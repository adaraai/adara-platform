export function ModelsPreview() {
  const models = [
    { name: "Twi-7B", status: "ready" },
    { name: "Yoruba-Speech", status: "ready" },
    { name: "Swahili-Context", status: "ready" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden px-4 pt-3 pb-0">
      <p className="mb-1.5 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        adara/models
      </p>
      <ul className="min-h-0 flex-1">
        {models.map((model) => (
          <li
            key={model.name}
            className="flex items-center justify-between border-b border-border/70 py-1.5 last:border-b-0"
          >
            <span className="text-[13px] text-foreground">{model.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{model.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
