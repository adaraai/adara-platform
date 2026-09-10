import { DocPage, Section, Code, IC } from "../DocProse";
import { API_BASE } from "../constants";

export default function UnderstandAudio() {
  return (
    <DocPage
      title="Understand Audio"
      description="Upload audio. Get a transcript plus meaning in one response."
      prev={{ label: "Understand Text", to: "/docs/understand-text" }}
      next={{ label: "Code-switching", to: "/docs/codeswitch" }}
    >
      <Section title="Request">
        <p>
          <IC>POST /v1/understand</IC> accepts a file. We transcribe first, then run the same
          understanding as the text endpoint.
        </p>
        <Code lang="bash">
{`curl -s ${API_BASE}/v1/understand \\
  -H "Authorization: Bearer $ADARA_API_KEY" \\
  -F "file=@turn.wav" \\
  -F "locale=GH"`}
        </Code>
      </Section>

      <Section title="Response">
        <Code lang="json">
{`{
  "transcript": "chale the momo no enter",
  "language": "tw",
  "concepts": ["familiar_address", "mobile_money"],
  "provisional": true,
  "status": "ok"
}`}
        </Code>
      </Section>

      <Section title="SDK">
        <Code lang="python">
{`with open("turn.wav", "rb") as f:
    meaning = client.understand(f, locale="GH")
print(meaning.transcript)
print(meaning.concepts)`}
        </Code>
      </Section>
    </DocPage>
  );
}
