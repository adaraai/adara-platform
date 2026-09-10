import { DocPage, Section, Code } from "../DocProse";

export default function ModelsCatalog() {
  return (
    <DocPage
      title="Models Catalog"
      description="See which speech and language features are enabled for your account."
      prev={{ label: "Languages Catalog", to: "/docs/languages-catalog" }}
    >
      <Section title="Request">
        <Code lang="text">{`GET /v1/models`}</Code>
        <p>Requires an API key. Use this if you need to feature-flag UI by capability.</p>
      </Section>
    </DocPage>
  );
}
