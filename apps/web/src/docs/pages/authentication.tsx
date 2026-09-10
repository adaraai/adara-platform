import { Link } from "react-router-dom";
import { DocPage, Section, Code, Callout, Table, IC } from "../DocProse";
import { API_BASE } from "../constants";

export default function Authentication() {
  return (
    <DocPage
      title="Authentication & Keys"
      description="How to send your API key and keep it safe."
      prev={{ label: "Quickstart", to: "/docs/quickstart" }}
      next={{ label: "Errors & Retries", to: "/docs/errors" }}
    >
      <Section title="Get a key">
        <p>
          Sign in to the{" "}
          <Link to="/login" className="underline hover:opacity-80">
            dashboard
          </Link>
          , open <strong>Developers</strong>, and create a key. Use one key per app so you can
          revoke it without touching everything else.
        </p>
        <Table
          headers={["Prefix", "Use for"]}
          rows={[
            [<IC key="live">sk_live_</IC>, "Production traffic"],
            [<IC key="test">sk_test_</IC>, "Staging and automated tests"],
          ]}
        />
      </Section>

      <Section title="Send the key">
        <p>
          Authenticated routes require <IC>Authorization: Bearer {"<key>"}</IC>.
        </p>
        <Code lang="bash">
{`curl ${API_BASE}/v1/understand \\
  -H "Authorization: Bearer $ADARA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "momo no enter", "locale": "GH"}'`}
        </Code>
        <p>
          In the SDK, pass the key once. Prefer the <IC>ADARA_API_KEY</IC> environment variable so
          it never lands in source:
        </p>
        <Code lang="python">
{`from adara import Adara

client = Adara()  # reads ADARA_API_KEY`}
        </Code>
        <Callout variant="caution">
          Keys belong on your backend. Do not ship them in a browser bundle or a mobile binary.
        </Callout>
      </Section>

      <Section title="Public routes">
        <p>
          <IC>GET /v1/health</IC> does not need a key. Use it for uptime checks.
        </p>
      </Section>
    </DocPage>
  );
}
