# ADARA Door

Public HTTP surface for **Hear / Understand / Speak** (`/v1`), backed by `adara-intelligence`.

## Run locally

```bash
# from adara-intelligence (once)
pip install -e ".[mms]"
python scripts/speech/download_mms.py   # optional; needed for STT/TTS

# from adara-platform
pip install -e services/door
# or: make api
ADARA_DOOR_DEV=1 PORT=8080 adara-door
```

Default API key in dev: `dev` (`ADARA_DOOR_DEV=1`). For real keys:

```bash
export ADARA_API_KEYS=sk_live_...,sk_other
export ADARA_DOOR_DEV=0
```

## Endpoints

| Method | Path | Auth |
|---|---|---|
| GET | `/v1/health` | no |
| GET | `/v1/languages`, `/v1/models` | Bearer |
| POST | `/v1/understand` | Bearer |
| POST | `/v1/speech/transcribe` | Bearer (multipart `file`) |
| POST | `/v1/speech/synthesize` | Bearer (JSON `text`, `language`) |

If MMS is not installed, health reports `transcribe` / `synthesize` false and those POSTs return **501** with a reason. **Understand** still works offline.

## Hugging Face (optional, for MMS downloads)

Never commit tokens. Set in your shell or a gitignored `.env` in `adara-intelligence`:

```bash
export HF_TOKEN=hf_...   # from https://huggingface.co/settings/tokens
```

Then cache weights once:

```bash
cd ../adara-intelligence
pip install -e ".[mms]"
python scripts/speech/download_mms.py
```

On Windows, `download_mms.py` sets `HF_HUB_DISABLE_SYMLINKS=1` automatically (avoids WinError 1314).
