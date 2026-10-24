import { useState } from "react";
import { ROOMS } from "../../shared/resort";
import { ImageCard, PageHero, Reveal, money } from "../components/ui-kit";
import { useSeo } from "../hooks/use-seo";
import { cn } from "../lib/utils";

const FILTERS = ["All", "Room", "Suite", "Villa"] as const;

export default function RoomsPage() {
  useSeo("Suites & Villas", "Ocean-view rooms, garden suites, oceanfront suites, private pool villas, cliffside villas and the Aliʻi Beach Estate at Lūana Kai, Kauaʻi.");
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const list = ROOMS.filter((r) => f === "All" || r.category === f);
  return (
    <>
      <PageHero image="/images/room-oceanfront.jpg" eyebrow="Stay" title="Suites & Villas" intro="Every room opens to the outdoors. Every view is of the mountains, the sea — or both." />
      <section className="mx-auto max-w-[1240px] px-6 py-20">
        <div className="mb-14 flex justify-center">
          <div className="glass flex gap-1 rounded-[14px] p-1.5">
            {FILTERS.map((x) => (
              <button key={x} onClick={() => setF(x)} className={cn("rounded-[10px] px-5 py-2 text-[13px] font-medium transition", f === x ? "bg-bone text-ink" : "text-bone/75 hover:text-bone")}>
                {x === "All" ? "All" : `${x}s`}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <Reveal key={r.slug} delay={(i % 3) * 0.08}>
              <ImageCard image={r.image} title={r.name} text={r.short} meta={`from ${money(r.rate)}/night`} href={`/rooms/${r.slug}`} />
              <div className="mt-4 flex gap-4 text-[12px] text-mist">
                <span>{r.size}</span>
                <span>·</span>
                <span>Sleeps {r.guests}</span>
                <span>·</span>
                <span>{r.view}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1240px] px-6 pb-28">
        <Reveal className="overflow-x-auto rounded-[12px] border border-line">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.16em] text-mist">
              <tr>
                {["Room", "Size", "Guests", "Bed", "View", "From"].map((h) => (
                  <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROOMS.map((r) => (
                <tr key={r.slug} className="border-t border-line">
                  <td className="px-5 py-4 font-display text-[16px]">{r.name}</td>
                  <td className="px-5 py-4 text-mist">{r.size}</td>
                  <td className="px-5 py-4 text-mist">{r.guests}</td>
                  <td className="px-5 py-4 text-mist">{r.bed}</td>
                  <td className="px-5 py-4 text-mist">{r.view}</td>
                  <td className="px-5 py-4 text-sand">{money(r.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>
    </>
  );
}
