type Task = {
  label: string;
  tag: string;
  status: "running" | "done" | "pending";
};

const tasks: Task[] = [
  { label: "Find untranslated Yoruba UI strings", tag: "explore", status: "done" },
  { label: "Fine-tune Twi speech model", tag: "build", status: "running" },
  { label: "Audit corpus consent flags", tag: "general", status: "pending" },
];

export function BentoAgentDemo() {
  return (
    <div className="flex h-full min-h-0 flex-col p-5 sm:p-6">
      <div className="mb-4 min-h-[8.75rem] shrink-0 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.label}
            className="flex items-center justify-between gap-3 font-mono text-[11px] sm:text-xs"
          >
            <span className="truncate text-foreground/80">{task.label}</span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="text-muted-foreground">{task.tag}</span>
              <StatusBadge status={task.status} />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto shrink-0 space-y-2 pt-4">
        <div className="flex h-5 items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="text-white/70">◆</span>
          <span>Thought for 2.4s</span>
        </div>
        <div className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          <span className="text-muted-foreground/50">▸</span> read_file corpus/sw-KE/annotations.json
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  if (status === "done") {
    return <span className="text-emerald-600 dark:text-emerald-400/90">[done]</span>;
  }
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-300/90">
        <span className="h-1 w-1 animate-pulse rounded-full bg-amber-500" />
        [running]
      </span>
    );
  }
  return <span className="text-muted-foreground/60">[queued]</span>;
}
