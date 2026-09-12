# ADARA Developer Quickstart

Get your first API call working in five minutes.

---

## 1. Get an API key

Generate one with the key script:

```bash
cd adara-intelligence/api
python scripts/generate_key.py
```

Output:

```
  sk_live_abc123...

Add to the Door:
  export ADARA_API_KEYS=sk_live_abc123...

Use in a request:
  curl -s http://localhost:8080/v1/health -H "Authorization: Bearer sk_live_abc123..."
```

**Keep it server-side.** Never put a key in a mobile app or browser bundle.

During local development you can skip key generation entirely — just set `ADARA_DOOR_DEV=1`
and use `dev` as the key.

---

## 2. Start the Door

```bash
# activate the project venv first
cd adara-org
.\.venv\Scripts\Activate.ps1        # Windows
# source .venv/bin/activate         # macOS / Linux

cd adara-intelligence/api/src
$env:ADARA_DOOR_DEV = '1'           # Windows PowerShell
$env:PORT = '8080'
python -m door
```

You should see:

```
INFO:     Application startup complete.
INFO uvicorn: Listening on http://127.0.0.1:8080
```

---

## 3. Check health

```bash
curl -s http://localhost:8080/v1/health | python -m json.tool
```

```json
{
  "status": "ok",
  "service": "adara-door",
  "mode": "development",
  "capabilities": {
    "understand": true,
    "transcribe": true,
    "synthesize": true,
    "reasons": {}
  }
}
```

If `transcribe` or `synthesize` are `false`, MMS weights are not installed yet — see
[MMS setup](../../adara-intelligence/api/README.md). `understand` works offline without them.

---

## 4. Call the API

Replace `dev` with your real key if you set `ADARA_API_KEYS`.

### Understand text

```bash
curl -s http://localhost:8080/v1/understand \
  -H "Authorization: Bearer dev" \
  -H "Content-Type: application/json" \
  -d '{"text": "chale the momo no enter", "locale": "GH"}'
```

Key fields in the response:

| Field | What it means |
|---|---|
| `language` | Detected language code (e.g. `tw`, `pcm`) |
| `concepts` | Stable ids for what was referred to (e.g. `mobile_money`) |
| `provisional` | `true` — knowledge packs are not yet reviewed by native speakers |
| `status` | `ok` / `interface_only` / `partial` |

### Transcribe audio (needs MMS)

```bash
curl -s http://localhost:8080/v1/speech/transcribe \
  -H "Authorization: Bearer dev" \
  -F "file=@call.wav" \
  -F "language=tw"
```

### Synthesize speech (needs MMS)

```bash
curl -s http://localhost:8080/v1/speech/synthesize \
  -H "Authorization: Bearer dev" \
  -H "Content-Type: application/json" \
  -d '{"text": "Mepa wo kyɛw", "language": "tw"}' \
  | python -c "import sys,json,base64; d=json.load(sys.stdin); open('out.wav','wb').write(base64.b64decode(d['audio_base64']))"
```

---

## 5. Browse the interactive docs

Open in your browser while the Door is running:

```
http://localhost:8080/v1/docs
```

Swagger UI loads all endpoints. Click **Authorize**, enter your key, and try any call live.

The raw spec is also available at:
- `http://localhost:8080/v1/openapi.json`
- `http://localhost:8080/v1/openapi.yaml`

---

## 6. Use the SDK (optional)

Instead of raw HTTP, use the Python or JavaScript SDK:

**Python**

```python
from adara import Adara

client = Adara(api_key='dev', base_url='http://localhost:8080')
result = client.understand('chale the momo no enter', locale='GH')
print(result.language)    # 'tw'
print(result.concepts)    # ['mobile_money', ...]
```

**JavaScript**

```js
import { Adara } from '@adara/sdk'

const client = new Adara({ apiKey: 'dev', baseUrl: 'http://localhost:8080' })
const result = await client.understand('chale the momo no enter', { locale: 'GH' })
console.log(result.language)   // 'tw'
console.log(result.concepts)   // ['mobile_money', ...]
```

---

## What is `provisional: true`?

Every knowledge pack today was assembled from secondary sources and has not been reviewed by a
native speaker. The API always tells you this so you can badge it in your UI rather than
presenting unreviewed glosses as facts.

When a pack is reviewed by a native speaker, `provisional` will become `false` for that
language. Until then, be honest with your users.

---

## What is `status: interface_only`?

It means no backend was registered — only the offline layers (language detection heuristics)
ran. This is different from `status: ok` where a real model backend ran. Surface it: it tells
a developer exactly what happened instead of silently returning a lower-quality result.

---

## Next steps

- **MMS speech** — install weights for Hear / Speak: see the [Door README](../../adara-intelligence/api/README.md)
- **Full API reference** — open `/v1/docs` or read [`docs/openapi/adara-v1.yaml`](openapi/adara-v1.yaml)
- **Mobile app** — point the voice-agent at this Door with `ADARA_MODE=api`
