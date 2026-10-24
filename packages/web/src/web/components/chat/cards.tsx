import { Link } from "wouter";
import { ArrowUpRight, CalendarCheck, Headset } from "lucide-react";
import { getRoom } from "../../../shared/resort";
import type { ChatCard } from "../../hooks/use-concierge-chat";
import { money } from "../ui-kit";

const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function ChatCardView({ card }: { card: ChatCard }) {
  if (card.type === "rooms") {
    const rooms = card.slugs.map(getRoom).filter(Boolean);
    return (
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 scrollbar-thin">
        {rooms.map((r) => (
          <div key={r!.slug} className="w-[210px] shrink-0 snap-start overflow-hidden rounded-xl border border-line bg-ink-2">
            <div className="relative h-[118px]">
              <img src={r!.image} alt={r!.name} className="h-full w-full object-cover" loading="lazy" />
              <span className="glass absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold">{r!.category}</span>
            </div>
            <div className="p-3">
              <p className="font-display text-[15px] leading-tight">{r!.name}</p>
              <p className="mt-1 text-[11px] text-mist">{r!.size} · sleeps {r!.guests}</p>
              <p className="mt-1 text-[12px] text-sand">from {money(r!.rate)}/night</p>
              <div className="mt-3 flex gap-2">
                <Link to={`/rooms/${r!.slug}`} className="flex-1 rounded-lg border border-line py-1.5 text-center text-[11px] font-semibold hover:border-bone/50">
                  View
                </Link>
                <Link to={`/book?room=${r!.slug}`} className="flex-1 rounded-lg bg-bone py-1.5 text-center text-[11px] font-semibold text-ink">
                  Request
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (card.type === "booking") {
    const room = getRoom(card.roomSlug);
    return (
      <div className="overflow-hidden rounded-xl border border-sand/30 bg-gradient-to-br from-sea/60 to-ink-2">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <CalendarCheck size={15} className="text-sand" />
          <span className="text-[12px] font-semibold">Booking request received</span>
          <span className="ml-auto font-mono text-[11px] text-sand">{card.reference}</span>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3 text-[12px]">
          <dt className="text-mist">Stay</dt>
          <dd className="text-right">{room?.name}</dd>
          <dt className="text-mist">Dates</dt>
          <dd className="text-right">{fmt(card.checkIn)} – {fmt(card.checkOut)}</dd>
          <dt className="text-mist">Guests</dt>
          <dd className="text-right">{card.adults} adult{card.adults > 1 ? "s" : ""}{card.children ? `, ${card.children} child${card.children > 1 ? "ren" : ""}` : ""}</dd>
          <dt className="text-mist">Estimate</dt>
          <dd className="text-right text-sand">{money(card.estimate)} <span className="text-mist">· {card.nights} nights, pre-tax</span></dd>
        </dl>
        <p className="border-t border-line px-4 py-2.5 text-[11px] text-mist">Our reservations team will confirm availability by email.</p>
      </div>
    );
  }
  if (card.type === "handoff") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[12px]">
        <Headset size={16} className="mt-0.5 shrink-0 text-sand" />
        <span className="text-mist">A team member has been notified and will join this chat shortly (7am–10pm HST).</span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {card.links.map((l) => (
        <Link key={l.href + l.label} to={l.href} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12px] hover:border-sand hover:text-sand">
          {l.label} <ArrowUpRight size={12} />
        </Link>
      ))}
    </div>
  );
}
