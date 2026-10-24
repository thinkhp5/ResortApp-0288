import { DINING } from "../../shared/resort";
import { PageHero, Reveal, Chip } from "../components/ui-kit";
import { openConcierge } from "../components/chat/chat-widget";
import { useSeo } from "../hooks/use-seo";

export default function DiningPage() {
  useSeo("Dining", "Kai Table beachfront tasting menus, Pāʻina island kitchen and the Sunset Lānai Bar at Lūana Kai, Kauaʻi.");
  return (
    <>
      <PageHero image="/images/dining-main.jpg" eyebrow="Dine" title="From Reef to Ridge" intro="Menus written each morning with Kauaʻi fishermen, farmers and our own māla garden." />
      <section className="mx-auto max-w-[1240px] space-y-28 px-6 py-24">
        {DINING.map((d, i) => (
          <div key={d.slug} className={`grid items-center gap-12 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal className="overflow-hidden rounded-[8px]">
              <img src={d.image} alt={d.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="eyebrow">{d.type}</p>
              <h2 className="mt-4 font-display text-[44px] font-light leading-tight">{d.name}</h2>
              <div className="mt-6 h-px w-12 bg-bone/35" />
              <p className="mt-6 text-mist">{d.description}</p>
              <p className="mt-5 text-[13px]">{d.hours}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {d.highlights.map((h) => <Chip key={h}>{h}</Chip>)}
              </div>
              <button onClick={() => openConcierge(`I'd like to reserve a table at ${d.name}. What do I need to know?`)} className="mt-10 rounded-[10px] bg-bone px-6 py-3 text-[13px] font-semibold text-ink hover:bg-white">
                Reserve a table
              </button>
            </Reveal>
          </div>
        ))}
      </section>
    </>
  );
}
