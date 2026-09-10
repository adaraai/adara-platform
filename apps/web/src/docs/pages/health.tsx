import { DocPage, Section, Code, Callout, IC } from "../DocProse";
import { API_BASE } from "../constants";

export default function Health() {
  return (
    <DocPage
      title="Health Check"
      description="Confirm the API is up. No key required."
      prev={{ label: "Testing", to: "/docs/sdk-testing" }}
      next={{ label: "Languages Catalog", to: "/docs/languages-catalog" }}
    >
      <Section title="Request">
        <Code lang="bash">{`curl -s ${API_BASE}/v1/health`}</Code>
      </Section>

      <Section title="Response">
        <Code lang="json">
{`{
  "status": "ok",
  "service": "adara-door",
  "capabilities": {
    "understand": true,
    "transcribe": true,
    "synthesize": true
  }
}`}
        </Code>
        <Callout variant="info">
          If a capability is <IC>false</IC>, that feature is not enabled on your account. Use
          another path (for example show text if speech is off) rather than retrying.
        </Callout>
      </Section>
    </DocPage>
  );
}
