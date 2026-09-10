"""adara voice-agent — the backend between the mobile voice UI and ADARA.

    Mobile UI  ->  this service  ->  adara-sdk  ->  ADARA intelligence

It exists so a phone makes one request per turn instead of four, and so the rules for degrading
when a capability is missing live in one place rather than in every client.

    ADARA_MODE=local python -m voice_agent          # runs the intelligence layer in-process
    ADARA_MODE=api ADARA_API_KEY=... python -m voice_agent

`local` is the default and needs no deployed API, which is the only reason this runs today.
"""

from .adara import AdaraGateway, Capabilities
from .agent import VoiceAgent
from .config import Config
from .policy import AgentPolicy, GroundedPolicy, Reply
from .server import Application, build, serve
from .sessions import Session, SessionStore, Turn

__all__ = [
    'AdaraGateway',
    'AgentPolicy',
    'Application',
    'Capabilities',
    'Config',
    'GroundedPolicy',
    'Reply',
    'Session',
    'SessionStore',
    'Turn',
    'VoiceAgent',
    'build',
    'serve',
]
