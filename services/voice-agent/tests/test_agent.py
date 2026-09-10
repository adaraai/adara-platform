"""Sessions, the reply policy, and turn orchestration.

The three things this service owns. Everything else it does is a thin wrapper over the SDK, which
has its own suite.
"""

from __future__ import annotations

import pytest
from adara import ServerError
from conftest import FakeGateway, meaning, no_transcription

from voice_agent.agent import (
    ERROR_AUDIO_TOO_LARGE,
    ERROR_EMPTY_INPUT,
    ERROR_NO_TRANSCRIPTION,
    ERROR_UNDERSTANDING_FAILED,
    VoiceAgent,
)
from voice_agent.policy import GroundedPolicy
from voice_agent.sessions import SessionStore

# =================================================================================================
# Sessions
# =================================================================================================

def test_a_session_remembers_the_locale_so_every_turn_need_not_resend_it(store):
    session = store.create(locale='NG')
    store.add_turn(session, role='user', text='first')
    assert store.get(session.id).locale == 'NG'


def test_a_settled_language_survives_a_later_abstention(store):
    """Text LID abstains on short utterances, and voice turns are short. Letting "yes" unset the
    session's language would send the next context lookup to every pack instead of the right one.
    """
    session = store.create()
    session.settle_language('pcm', source='detected')
    session.settle_language(None, source='detected')

    assert session.language == 'pcm'
    assert session.language_source == 'detected'


def test_a_client_supplied_language_is_recorded_as_such(store):
    session = store.create(language='tw')
    assert (session.language, session.language_source) == ('tw', 'client')


def test_turns_are_capped_so_a_long_call_forgets_rather_than_fails(store):
    session = store.create()
    for index in range(8):
        store.add_turn(session, role='user', text=f'turn {index}')

    assert len(session.turns) == 5
    assert session.turns[0].text == 'turn 3', 'the oldest turns fall off, not the newest'


def test_expired_sessions_are_swept_on_the_next_write():
    """No background thread, so there is nothing to leak if the sweep is never scheduled."""
    clock = [1000.0]
    store = SessionStore(ttl_seconds=60, clock=lambda: clock[0])
    session = store.create()

    clock[0] += 61
    assert store.get(session.id) is None
    assert len(store) == 0


def test_ending_a_session_closes_its_event_streams(store):
    """A phone still holding a stream open must be told the conversation is over."""
    session = store.create()
    received = []
    store.subscribe(session.id, received.append)

    store.delete(session.id)

    assert received == [None], 'None is the close signal the SSE loop watches for'
    assert store.listener_count(session.id) == 0


def test_a_broken_listener_is_dropped_instead_of_breaking_the_turn(store):
    session = store.create()

    def broken(_event):
        raise RuntimeError('client vanished')

    store.subscribe(session.id, broken)
    store.publish(session.id, {'event': 'turn.created', 'data': {}})

    assert store.listener_count(session.id) == 0


def test_the_turn_summary_is_small_enough_to_push_to_a_phone(store):
    """A meaning object is kilobytes of provenance. The turn list must not carry it."""
    session = store.create()
    turn = store.add_turn(session, role='user', text='NEPA don take light')
    turn.meaning = meaning()
    turn.reply = {'text': 'ok', 'warnings': []}

    summary = turn.summary()
    assert 'meaning' not in summary
    assert summary['concepts'] == ['electricity_utility']
    assert summary['provisional'] is True


# =================================================================================================
# The reply policy
# =================================================================================================

def test_every_reply_says_it_was_not_generated():
    """There is no model here. A reply that did not say so would be the one dishonest field."""
    reply = GroundedPolicy().reply(meaning())
    assert reply.source == 'grounded_template'


def test_an_understood_utterance_is_read_back_and_says_nothing_was_acted_on():
    """Without the second sentence, an acknowledgement reads as an action."""
    reply = GroundedPolicy().reply(meaning())

    assert reply.act == 'acknowledge'
    assert 'NEPA' in reply.text
    assert 'not acted on anything' in reply.text
    assert reply.grounded_on == ('NEPA',)


def test_an_ambiguous_term_is_asked_about_rather_than_guessed():
    """The engine already knows it could not choose. Asking is strictly better than picking."""
    ambiguous = meaning(context={'matches': [{
        'term': 'chama', 'concept': 'rotating_savings', 'gloss': 'A savings group.',
        'ambiguous': True,
        'alternatives': [{'term': 'chama cha siasa', 'concept': 'political_party',
                          'gloss': 'A political party.'}],
    }], 'gaps': [], 'provisional': True})

    reply = GroundedPolicy().reply(ambiguous)

    assert reply.act == 'clarify_sense'
    assert reply.expects_answer is True
    assert 'savings' in reply.text and 'political party' in reply.text


def test_an_unknown_word_is_asked_about_which_is_how_the_backlog_shrinks():
    """The speaker is the one person who can close a gap, so the agent asks them."""
    with_gap = meaning(context={'matches': [], 'gaps': [
        {'text': 'kɔforidua', 'reason': 'unknown_orthography', 'nearest_term': ''},
    ], 'provisional': True})

    reply = GroundedPolicy().reply(with_gap)

    assert reply.act == 'ask_unknown_term'
    assert reply.expects_answer is True
    assert 'kɔforidua' in reply.text


def test_a_near_miss_offers_the_word_it_nearly_matched():
    near = meaning(context={'matches': [], 'gaps': [
        {'text': 'matabo', 'reason': 'near_miss', 'nearest_term': 'matatu'},
    ], 'provisional': True})

    reply = GroundedPolicy().reply(near)
    assert 'matabo' in reply.text and 'matatu' in reply.text


def test_nothing_recognised_says_so_rather_than_apologising_vaguely():
    """Telling the speaker the problem is coverage, not audio, is actionable. "Sorry" is not."""
    empty = meaning(context={'matches': [], 'gaps': [], 'provisional': True},
                    transcript='the weather is fine today')

    reply = GroundedPolicy().reply(empty)
    assert reply.act == 'report_unavailable'
    assert 'knowledge about' in reply.text


def test_no_transcript_asks_for_a_repeat():
    reply = GroundedPolicy().reply(meaning(transcript=None, status='error'))
    assert reply.act == 'ask_repeat'
    assert reply.expects_answer is True


def test_a_reply_is_short_enough_to_speak():
    """A voice agent reading a paragraph of gloss is unusable. The full text stays in `meaning`."""
    verbose = meaning(context={'matches': [{
        'term': 'NEPA', 'ambiguous': False, 'alternatives': [], 'sensitivity': '',
        'gloss': 'Colloquial name for the electricity supply ' + 'and a great deal more text ' * 20,
    }], 'gaps': [], 'provisional': True})

    reply = GroundedPolicy().reply(verbose)
    assert len(reply.text) < 400, 'a spoken reply must not be a paragraph'


def test_every_caveat_reaches_the_reply():
    """These fields exist to stop over-trust. A policy that dropped them would be laundering
    them."""
    risky = meaning(
        status='partial',
        provisional=True,
        language_evidence={'agreement': False, 'candidates': [],
                           'region_check': {'consistent': False, 'note': 'not spoken there'}},
        context={'matches': [{'term': 'olodo', 'sensitivity': 'An insult.', 'gloss': 'Dunce.',
                              'ambiguous': False, 'alternatives': []}],
                 'gaps': [], 'provisional': True},
    )

    warnings = ' '.join(GroundedPolicy().reply(risky).warnings)
    assert 'degraded' in warnings
    assert 'native speaker' in warnings
    assert 'disagreed' in warnings
    assert 'olodo' in warnings and 'insult' in warnings.lower()


def test_speech_availability_is_stated_rather_than_assumed():
    """The UI needs to know whether to expect audio back before it builds a player."""
    silent = GroundedPolicy(speech_available=False, speech_reason='no weights').reply(meaning())
    assert silent.speech == {'available': False, 'reason': 'no weights'}


# =================================================================================================
# Turn orchestration
# =================================================================================================

def _agent(store, **gateway_kwargs) -> tuple[VoiceAgent, FakeGateway]:
    gateway = FakeGateway(**gateway_kwargs)
    return VoiceAgent(gateway, store), gateway


def test_a_text_turn_is_understood_and_replied_to(store):
    agent, gateway = _agent(store)
    session = store.create(locale='NG')

    turn = agent.submit_text(session, 'NEPA don take light')

    assert turn.status == 'replied'
    assert turn.transcript_source == 'typed'
    assert turn.meaning['concepts'] == ['electricity_utility']
    assert turn.reply['act'] == 'acknowledge'
    assert ('understand', 'NEPA don take light', 'NG', None) in gateway.calls


def test_the_session_language_is_passed_into_the_next_turn(store):
    """The reason a session exists: the second turn should not re-detect what the first settled."""
    agent, gateway = _agent(store)
    session = store.create(locale='NG')

    agent.submit_text(session, 'NEPA don take light')
    agent.submit_text(session, 'and the POS too')

    assert session.language == 'pcm'
    assert gateway.calls[-1] == ('understand', 'and the POS too', 'NG', 'pcm')


def test_an_empty_turn_fails_without_calling_adara(store):
    agent, gateway = _agent(store)
    session = store.create()

    turn = agent.submit_text(session, '   ')

    assert turn.status == 'failed'
    assert turn.error['code'] == ERROR_EMPTY_INPUT
    assert gateway.calls == []


def test_an_audio_turn_without_asr_fails_recoverably_and_keeps_the_turn(store):
    """The state of every deployment today. The UI should offer the keyboard, not an error page."""
    agent, _ = _agent(store, transcribe_error=no_transcription())
    session = store.create()

    turn = agent.submit_audio(session, 'call.wav', b'RIFFdata')

    assert turn.status == 'failed'
    assert turn.error['code'] == ERROR_NO_TRANSCRIPTION
    assert turn.error['recoverable'] is True
    assert turn.reply is not None, 'a failed turn still gets something to say'
    assert turn in session.turns, 'the turn is kept, not discarded'


def test_a_transcribe_500_asks_the_user_to_type(store):
    agent, _ = _agent(store, transcribe_error=ServerError('HTTP 500', status_code=500))
    session = store.create()

    turn = agent.submit_audio(session, 'turn.m4a', b'not-wav')

    assert turn.status == 'failed'
    assert turn.error['recoverable'] is True
    assert 'Type what you said' in turn.error['message']
    assert 'HTTP 500' not in turn.error['message']


def test_an_audio_turn_with_asr_flows_into_understanding(store):
    agent, gateway = _agent(store, transcript='NEPA don take light')
    session = store.create(locale='NG')

    turn = agent.submit_audio(session, 'call.wav', b'RIFFdata')

    assert turn.status == 'replied'
    assert turn.transcript_source == 'asr'
    assert turn.text == 'NEPA don take light'
    assert gateway.calls[0] == ('transcribe', 'call.wav', 8, 'eng')


def test_oversized_audio_is_rejected_before_it_reaches_a_model(store):
    agent, gateway = _agent(store, transcript='x')
    agent._max_audio_bytes = 10
    session = store.create()

    turn = agent.submit_audio(session, 'call.wav', b'x' * 50)

    assert turn.error['code'] == ERROR_AUDIO_TOO_LARGE
    assert gateway.calls == [], 'a rejected upload must not spend model time'


def test_a_broken_understanding_backend_degrades_rather_than_raising(store):
    agent, _ = _agent(store, understand_error=ServerError('boom', status_code=500))
    session = store.create()

    turn = agent.submit_text(session, 'NEPA don take light')

    assert turn.status == 'failed'
    assert turn.error['code'] == ERROR_UNDERSTANDING_FAILED
    assert turn.error['recoverable'] is False


def test_each_stage_publishes_progress_before_the_next_one_starts(store):
    """A voice UI showing nothing for two seconds feels broken."""
    agent, _ = _agent(store, transcript='NEPA don take light')
    session = store.create()
    events = []
    store.subscribe(session.id, lambda event: events.append(event['event']))

    agent.submit_audio(session, 'call.wav', b'RIFFdata')

    assert events == ['turn.created', 'turn.transcribed', 'turn.understood', 'turn.replied']


def test_a_failed_turn_publishes_a_failure_event(store):
    agent, _ = _agent(store, transcribe_error=no_transcription())
    session = store.create()
    events = []
    store.subscribe(session.id, lambda event: events.append(event['event']))

    agent.submit_audio(session, 'call.wav', b'RIFF')

    assert events == ['turn.created', 'turn.failed']


def test_a_product_can_replace_the_policy_without_touching_anything_else(store):
    """The seam that keeps health triage and payment workflows out of a platform service."""
    class ProductPolicy:
        def reply(self, meaning, *, history=None):
            from voice_agent.policy import Reply

            return Reply(text='routed to the payments flow', source='product:payments',
                         act='acknowledge')

    gateway = FakeGateway()
    agent = VoiceAgent(gateway, store, policy=ProductPolicy())
    session = store.create()

    turn = agent.submit_text(session, 'the momo no enter')

    assert turn.reply['source'] == 'product:payments'
    assert turn.reply['text'] == 'routed to the payments flow'


@pytest.mark.parametrize('code', [ERROR_NO_TRANSCRIPTION, ERROR_UNDERSTANDING_FAILED,
                                  ERROR_EMPTY_INPUT, ERROR_AUDIO_TOO_LARGE])
def test_error_codes_are_stable_strings(code):
    """The mobile client branches on these. They are added to, never reworded."""
    assert code == code.lower() and ' ' not in code
