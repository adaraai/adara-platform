/**
 * The full mic → session → turn → reply loop in one hook.
 *
 * Mic state machine:
 *   idle → recording → processing → idle
 */

import {
  AudioModule,
  AudioQuality,
  IOSOutputFormat,
  RecordingPresets,
  createAudioPlayer,
  setAudioModeAsync,
  useAudioRecorder,
  type AudioPlayer,
} from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";

import { agent, api, type Capabilities, type Session, type Turn } from "@/lib/api";
import { getVoicePrefs, sessionOptionsFromPrefs } from "@/lib/voicePrefs";

/** MMS decodes WAV/PCM. Expo's default HIGH_QUALITY is AAC/m4a, which Door returns as HTTP 500. */
const ASR_RECORDING = {
  ...RecordingPresets.HIGH_QUALITY,
  extension: ".wav",
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  ios: {
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: AudioQuality.HIGH,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  android: {
    outputFormat: "mpeg4" as const,
    audioEncoder: "aac" as const,
    extension: ".m4a",
    sampleRate: 16000,
  },
};

export type MicState = "idle" | "recording" | "processing";

export type VoiceSessionState = {
  loading: boolean;
  session: Session | null;
  capabilities: Capabilities | null;
  turns: Turn[];
  micState: MicState;
  error: string | null;
  startRecording: () => Promise<void>;
  stopAndSend: () => Promise<void>;
  sendText: (text: string) => Promise<void>;
  speakReply: (text: string, language?: string | null) => Promise<void>;
};

export function useVoiceSession(options: {
  locale?: string;
  language?: string;
} = {}): VoiceSessionState {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [micState, setMicState] = useState<MicState>("idle");
  const [error, setError] = useState<string | null>(null);

  const recorder = useAudioRecorder(ASR_RECORDING);
  const sessionIdRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);

      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setError("Microphone permission is required for voice input.");
        setLoading(false);
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      const prefs = getVoicePrefs();
      const result = await agent.createSession({
        ...sessionOptionsFromPrefs({
          locale: options.locale ?? prefs.locale,
          speechLanguage: options.language ?? prefs.speechLanguage,
        }),
      });

      if (cancelled) return;

      if (!result.ok) {
        setError(result.message);
        setLoading(false);
        return;
      }

      const { session: s, capabilities: caps } = result.data;
      setSession(s);
      setCapabilities(caps);
      setTurns(s.turns ?? []);
      sessionIdRef.current = s.id;
      setLoading(false);

      unsubscribeRef.current = agent.subscribe(s.id, (turn) => {
        setTurns((prev) => {
          const idx = prev.findIndex((t) => t.id === turn.id);
          if (idx === -1) return [...prev, turn];
          const next = [...prev];
          next[idx] = turn;
          return next;
        });
        if (turn.status === "replied" && turn.reply?.text) {
          const ttsLang =
            (turn.reply.speech as { language?: string } | undefined)?.language ??
            turn.meaning?.language ??
            null;
          speakReply(turn.reply.text, ttsLang);
        }
      });
    }

    init();

    return () => {
      cancelled = true;
      unsubscribeRef.current?.();
      if (sessionIdRef.current) {
        agent.endSession(sessionIdRef.current);
      }
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const speakReply = useCallback(
    async (text: string, language?: string | null) => {
      if (!capabilities?.synthesize) return;
      if (!text.trim()) return;

      try {
        playerRef.current?.remove();
        playerRef.current = null;

        const result = await api.synthesize(text, language ? { language } : {});
        if (!result.ok) return;

        const player = createAudioPlayer({
          uri: `data:audio/wav;base64,${result.data.audio_base64}`,
        });
        playerRef.current = player;
        player.play();
      } catch {
        // Playback errors are non-fatal — the text reply is already displayed.
      }
    },
    [capabilities],
  );

  const startRecording = useCallback(async () => {
    if (micState !== "idle") return;
    if (!sessionIdRef.current) return;

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setMicState("recording");
    } catch (err) {
      setError(`Could not start recording: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [micState, recorder]);

  const stopAndSend = useCallback(async () => {
    if (micState !== "recording") return;
    const sid = sessionIdRef.current;
    if (!sid) return;

    setMicState("processing");

    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) {
        setMicState("idle");
        return;
      }

      const isWav = uri.toLowerCase().includes(".wav");
      const result = await agent.sendAudio(sid, uri, {
        name: isWav ? "turn.wav" : "turn.m4a",
        type: isWav ? "audio/wav" : "audio/m4a",
      });

      if (result.ok) {
        setTurns((prev) => {
          const { turn } = result.data;
          const idx = prev.findIndex((t) => t.id === turn.id);
          if (idx === -1) return [...prev, turn];
          const next = [...prev];
          next[idx] = turn;
          return next;
        });
      } else {
        setError(result.message);
      }
    } finally {
      setMicState("idle");
    }
  }, [micState, recorder]);

  const sendText = useCallback(async (text: string) => {
    const sid = sessionIdRef.current;
    if (!sid || !text.trim()) return;

    setMicState("processing");
    const result = await agent.sendText(sid, text);
    setMicState("idle");

    if (result.ok) {
      setTurns((prev) => {
        const { turn } = result.data;
        const idx = prev.findIndex((t) => t.id === turn.id);
        if (idx === -1) return [...prev, turn];
        const next = [...prev];
        next[idx] = turn;
        return next;
      });
    } else {
      setError(result.message);
    }
  }, []);

  return {
    loading,
    session,
    capabilities,
    turns,
    micState,
    error,
    startRecording,
    stopAndSend,
    sendText,
    speakReply,
  };
}
