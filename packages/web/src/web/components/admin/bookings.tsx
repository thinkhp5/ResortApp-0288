import { useState } from "react";
import { getRoom, OFFERS } from "../../../shared/resort";
import { useAdminBookings, useAdminEnquiries, useAdminMarkEnquiry, useAdminUpdateBooking } from "../../queries/admin";
import { cn } from "../../lib/utils";
import { money, Spinner } from "../ui-kit";
import { ago, Empty, Pill, Segmented, shortDate } from "./shared";

type Status = "all" | "new" | "confirmed" | "declined" | "cancelled";
const TONE = { new: "sand", confirmed: "green", declined: "red", cancelled: "muted" } as const;

export function BookingsPanel() {
  const [status, setStatus] = useState<Status>("all");
  const q = useAdminBookings(status);
  const update = useAdminUpdateBooking();

  return (
    <div className="space-y-4">
      <Segmented
        value={status}
        onChange={setStatus}
        options={(["all", "new", "confirmed", "declined", "cancelled"] as const).map((s) => ({ value: s, label: s[0]!.toUpperCase() + s.slice(1) }))}
      />
      <div className="overflow-hidden rounded-[14px] border border-line">
        {q.isLoading && <div className="grid place-items-center py-16 text-mist"><Spinner /></div>}
        {q.error && <p className="p-4 text-[13px] text-red-300">{q.error.message}</p>}
        {q.data?.length === 0 && <Empty title="No booking requests" text="Requests from the website and the concierge land here." />}
        {q.data?.map((b) => (
          <div key={b.id} className="grid gap-4 border-b border-line/60 p-5 last:border-0 md:grid-cols-[1.3fr_1fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[13px] font-semibold text-sand">{b.reference}</span>
                <Pill tone={TONE[b.status]}>{b.status}</Pill>
                <Pill>{b.source === "chat" ? "via concierge" : "web form"}</Pill>
                <span className="text-[11px] text-mist">{ago(b.createdAt)}</span>
              </div>
              <p className="mt-2 font-semibold">{b.name}</p>
              <p className="text-[13px] text-mist">
                <a href={`mailto:${b.email}`} className="hover:text-bone">{b.email}</a>
                {b.phone && ` · ${b.phone}`}
              </p>
              {b.notes && <p className="mt-2 line-clamp-2 text-[13px] text-bone/80">“{b.notes}”</p>}
            </div>
            <div className="text-[13px]">
              <p className="font-semibold">{getRoom(b.roomSlug)?.name ?? b.roomSlug}</p>
              <p className="text-mist">{shortDate(b.checkIn)} → {shortDate(b.checkOut)} · {b.nights} nights</p>
              <p className="text-mist">{b.adults} adults{b.children ? `, ${b.children} children` : ""}</p>
              <p className="mt-1">{money(b.estimate)}{b.offerSlug && <span className="text-sand"> · {OFFERS.find((o) => o.slug === b.offerSlug)?.name}</span>}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {(["confirmed", "declined", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  disabled={b.status === s}
                  onClick={() => update.mutate({ id: b.id, status: s })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[12px] font-semibold capitalize transition disabled:cursor-default",
                    b.status === s ? "border-transparent bg-bone text-ink" : "border-line text-mist hover:border-bone/50 hover:text-bone",
                  )}
                >
                  {s === "confirmed" ? "Confirm" : s === "declined" ? "Decline" : "Cancel"}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EnquiriesPanel() {
  const q = useAdminEnquiries();
  const mark = useAdminMarkEnquiry();
  return (
    <div className="overflow-hidden rounded-[14px] border border-line">
      {q.isLoading && <div className="grid place-items-center py-16 text-mist"><Spinner /></div>}
      {q.error && <p className="p-4 text-[13px] text-red-300">{q.error.message}</p>}
      {q.data?.length === 0 && <Empty title="No enquiries yet" text="Messages from the contact form appear here." />}
      {q.data?.map((e) => (
        <div key={e.id} className={cn("flex flex-col gap-3 border-b border-line/60 p-5 last:border-0 md:flex-row md:items-start", e.handled && "opacity-60")}>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{e.name}</span>
              <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.subject ?? "Your enquiry"}`)}`} className="text-[13px] text-mist hover:text-bone">{e.email}</a>
              {e.handled ? <Pill tone="green">Handled</Pill> : <Pill tone="sand">Open</Pill>}
              <span className="text-[11px] text-mist">{ago(e.createdAt)}</span>
            </div>
            {e.subject && <p className="mt-2 text-[13px] font-semibold">{e.subject}</p>}
            <p className="mt-1 whitespace-pre-wrap text-[14px] text-bone/85">{e.message}</p>
          </div>
          <button
            onClick={() => mark.mutate({ id: e.id, handled: !e.handled })}
            className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-[12px] font-semibold hover:border-bone/50"
          >
            {e.handled ? "Mark open" : "Mark handled"}
          </button>
        </div>
      ))}
    </div>
  );
}
