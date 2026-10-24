import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";
import { OFFERS, POLICIES, ROOMS, getRoom } from "../../shared/resort";
import { ButtonLink, Reveal, Spinner, money } from "../components/ui-kit";
import { openConcierge } from "../components/chat/chat-widget";
import { useCreateBooking } from "../queries/public";
import { useSeo } from "../hooks/use-seo";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => {
  const d = new Date(`${s}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};
const fmt = (s: string) =>
  new Date(`${s}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function initialParams() {
  const p = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const room = p.get("room");
  const offer = p.get("offer");
  return {
    room: room && getRoom(room) ? room : ROOMS[0]!.slug,
    offer: offer && OFFERS.some((o) => o.slug === offer) ? offer : "",
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">{children}</span>;
}

export default function BookPage() {
  useSeo("Request a Stay", "Request your dates at Lūana Kai Resort & Villas — our reservations team confirms availability within a few hours.");
  const init = useMemo(initialParams, []);
  const today = iso(new Date());
  const [f, setF] = useState({
    roomSlug: init.room,
    offerSlug: init.offer,
    checkIn: addDays(today, 30),
    checkOut: addDays(today, 35),
    adults: 2,
    children: 0,
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const booking = useCreateBooking();
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const room = getRoom(f.roomSlug)!;
  const offer = OFFERS.find((o) => o.slug === f.offerSlug);
  const nights = Math.round((new Date(f.checkOut).getTime() - new Date(f.checkIn).getTime()) / 86_400_000);
  const validNights = Number.isFinite(nights) && nights > 0;
  const overCapacity = f.adults + f.children > room.guests;

  if (booking.data) {
    const b = booking.data;
    return (
      <section className="relative min-h-[90vh] overflow-hidden pt-40 pb-24">
        <img src="/images/gallery-beach.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="panel-gradient grain relative mx-auto max-w-xl overflow-hidden rounded-[16px] p-10 text-center"
        >
          <div className="relative">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand text-ink">
              <Check size={22} />
            </span>
            <p className="eyebrow mt-6">Request received</p>
            <h1 className="mt-3 font-display text-4xl font-light">Mahalo, {f.name.split(" ")[0]}</h1>
            <p className="mt-4 text-mist">
              Our reservations team will confirm availability for your stay and email <span className="text-bone">{f.email}</span> within a few hours.
            </p>
            <div className="mt-8 rounded-xl border border-line p-5 text-left text-[14px]">
              <div className="flex justify-between"><span className="text-mist">Reference</span><span className="font-mono font-semibold tracking-wider text-sand">{b.reference}</span></div>
              <div className="mt-2 flex justify-between"><span className="text-mist">Residence</span><span>{b.room}</span></div>
              <div className="mt-2 flex justify-between"><span className="text-mist">Dates</span><span>{fmt(b.checkIn)} → {fmt(b.checkOut)}</span></div>
              <div className="mt-2 flex justify-between"><span className="text-mist">Estimate</span><span>{money(b.estimate)} · {b.nights} nights</span></div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/experiences" variant="outline">Plan experiences</ButtonLink>
              <ButtonLink href="/">Back to home</ButtonLink>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-10">
        <img src={room.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-ink" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow mb-4">Reservations</p>
          <h1 className="font-display text-5xl font-light md:text-6xl">Request your stay</h1>
          <div className="mx-auto mt-6 h-px w-12 bg-bone/35" />
          <p className="mx-auto mt-6 max-w-lg text-mist">Tell us your dates and we'll hold the best residence for you. No payment is taken until your stay is confirmed.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-8 px-6 pb-28 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <form
            className="panel-gradient grain relative overflow-hidden rounded-[16px] p-7 md:p-10"
            onSubmit={(e) => {
              e.preventDefault();
              booking.mutate({
                ...f,
                offerSlug: f.offerSlug || null,
                phone: f.phone || null,
                notes: f.notes || null,
              });
            }}
          >
            <div className="relative grid gap-7 md:grid-cols-2">
              <label className="block">
                <Label>Check-in</Label>
                <input
                  type="date"
                  aria-label="Check-in date"
                  className="field [color-scheme:dark]"
                  min={today}
                  required
                  value={f.checkIn}
                  onChange={(e) => {
                    const v = e.target.value;
                    setF((s) => ({ ...s, checkIn: v, checkOut: s.checkOut <= v ? addDays(v, 3) : s.checkOut }));
                  }}
                />
              </label>
              <label className="block">
                <Label>Check-out</Label>
                <input type="date" aria-label="Check-out date" className="field [color-scheme:dark]" min={addDays(f.checkIn || today, 1)} required value={f.checkOut} onChange={(e) => set("checkOut", e.target.value)} />
              </label>
              <label className="block md:col-span-2">
                <Label>Residence</Label>
                <select className="field bg-transparent" value={f.roomSlug} onChange={(e) => set("roomSlug", e.target.value)}>
                  {ROOMS.map((r) => (
                    <option key={r.slug} value={r.slug} className="bg-ink">
                      {r.name} — from {money(r.rate)}/night · up to {r.guests} guests
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <Label>Adults</Label>
                <select className="field" value={f.adults} onChange={(e) => set("adults", Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n} className="bg-ink">{n}</option>)}
                </select>
              </label>
              <label className="block">
                <Label>Children</Label>
                <select className="field" value={f.children} onChange={(e) => set("children", Number(e.target.value))}>
                  {Array.from({ length: 9 }, (_, i) => i).map((n) => <option key={n} value={n} className="bg-ink">{n}</option>)}
                </select>
              </label>
              <label className="block md:col-span-2">
                <Label>Offer (optional)</Label>
                <select className="field" value={f.offerSlug} onChange={(e) => set("offerSlug", e.target.value)}>
                  <option value="" className="bg-ink">Best available rate</option>
                  {OFFERS.map((o) => <option key={o.slug} value={o.slug} className="bg-ink">{o.name} — {o.perk}</option>)}
                </select>
              </label>
              <label className="block">
                <Label>Full name</Label>
                <input className="field" required minLength={2} aria-label="Your name" placeholder="Your name" value={f.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label className="block">
                <Label>Email</Label>
                <input className="field" type="email" required aria-label="you@example.com" placeholder="you@example.com" value={f.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="block md:col-span-2">
                <Label>Phone (optional)</Label>
                <input className="field" type="tel" aria-label="+1 …" placeholder="+1 …" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label className="block md:col-span-2">
                <Label>Anything we should know?</Label>
                <textarea className="field min-h-[90px] resize-y" aria-label="Celebrations, arrival time, dietary needs…" placeholder="Celebrations, arrival time, dietary needs…" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
              </label>
            </div>

            {overCapacity && <p className="relative mt-6 text-[13px] text-sand">{room.name} sleeps up to {room.guests} guests — choose a larger residence or adjust your party.</p>}
            {booking.error && <p className="relative mt-6 text-[13px] text-destructive">{booking.error.message}</p>}

            <button
              disabled={booking.isPending || overCapacity || !validNights}
              className="relative mt-8 flex w-full items-center justify-center gap-2 rounded-[10px] bg-bone py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-white disabled:opacity-50"
            >
              {booking.isPending && <Spinner />} Send booking request
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[16px] border border-line">
            <div className="relative aspect-[16/10]">
              <img src={room.image} alt={room.name} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="eyebrow">{room.category}</p>
                <p className="mt-1 font-display text-2xl">{room.name}</p>
              </div>
            </div>
            <div className="space-y-3 p-6 text-[14px]">
              <div className="flex justify-between"><span className="text-mist">Dates</span><span>{validNights ? `${fmt(f.checkIn)} → ${fmt(f.checkOut)}` : "—"}</span></div>
              <div className="flex justify-between"><span className="text-mist">Guests</span><span>{f.adults} adult{f.adults > 1 ? "s" : ""}{f.children ? `, ${f.children} child${f.children > 1 ? "ren" : ""}` : ""}</span></div>
              <div className="flex justify-between"><span className="text-mist">Rate</span><span>{money(room.rate)} × {validNights ? nights : 0} nights</span></div>
              {offer && <div className="flex justify-between"><span className="text-mist">Offer</span><span className="text-sand">{offer.name}</span></div>}
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-mist">Estimated total</span>
                <span className="font-display text-3xl">{validNights ? money(nights * room.rate) : "—"}</span>
              </div>
              <p className="text-[12px] text-mist">Before taxes, resort fee and offer savings. Final pricing is confirmed by our team.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openConcierge(`I'm looking at the ${room.name}. Can you help me plan my stay?`)}
            className="flex w-full items-center gap-4 rounded-[16px] border border-line p-5 text-left transition hover:border-bone/40"
          >
            <MessageCircle className="text-sand" size={20} />
            <span>
              <span className="block font-semibold">Not sure which residence?</span>
              <span className="text-[13px] text-mist">Ask Leilani, our concierge, or a team member.</span>
            </span>
          </button>
          <ul className="space-y-2 px-1 text-[12px] text-mist">
            {POLICIES.slice(0, 3).map((p) => (
              <li key={p.q}>· {p.q}: {p.a}</li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
