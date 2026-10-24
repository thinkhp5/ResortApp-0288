import { cn } from "../../lib/utils";

export const ago = (d: Date | string | number) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const shortDate = (s: string) =>
  new Date(`${s}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function Pill({ children, tone = "muted", className }: { children: React.ReactNode; tone?: "muted" | "sand" | "sea" | "green" | "red"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
        tone === "muted" && "bg-white/[0.07] text-mist",
        tone === "sand" && "bg-sand text-ink",
        tone === "sea" && "bg-sea/40 text-bone",
        tone === "green" && "bg-emerald-400/15 text-emerald-300",
        tone === "red" && "bg-red-400/15 text-red-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string; badge?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-[10px] border border-line p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[12px] font-semibold transition",
            value === o.value ? "bg-bone text-ink" : "text-mist hover:text-bone",
          )}
        >
          {o.label}
          {!!o.badge && <span className={cn("rounded-full px-1.5 text-[10px]", value === o.value ? "bg-ink text-bone" : "bg-sand text-ink")}>{o.badge}</span>}
        </button>
      ))}
    </div>
  );
}

export function Empty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <div>
        <p className="font-display text-xl">{title}</p>
        {text && <p className="mt-2 text-[13px] text-mist">{text}</p>}
      </div>
    </div>
  );
}
