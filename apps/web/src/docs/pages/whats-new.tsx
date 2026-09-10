import { DocPage, Section, Pill, IC } from "../DocProse";

export default function WhatsNew() {
  return (
    <DocPage
      title="What's New"
      description="Product changes that affect how you integrate."
      prev={{ label: "Introduction", to: "/docs/introduction" }}
      next={{ label: "Quickstart", to: "/docs/quickstart" }}
    >
      <Section title="September 2026">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-zinc-900 dark:text-white">Spoken replies</span>
              <Pill variant="green">New</Pill>
            </div>
            <p>
              After a voice turn, call <IC>POST /v1/speech/synthesize</IC> with the reply text to
              play audio back to the user.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-zinc-900 dark:text-white">Language and context routes</span>
              <Pill variant="green">New</Pill>
            </div>
            <p>
              <IC>/v1/language/detect</IC>, <IC>/v1/language/entities</IC>,{" "}
              <IC>/v1/context/resolve</IC>, and <IC>/v1/context/coverage</IC> are live.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Coming next">
        <ul className="list-disc pl-5 space-y-2">
          <li>Streaming speech-to-text</li>
          <li>Streaming text-to-speech</li>
          <li>Embeddable speech widget</li>
        </ul>
      </Section>
    </DocPage>
  );
}
