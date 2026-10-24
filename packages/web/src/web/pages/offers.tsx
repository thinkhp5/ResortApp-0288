import { OFFERS } from "../../shared/resort";
import { ButtonLink, PageHero, Reveal } from "../components/ui-kit";
import { useSeo } from "../hooks/use-seo";

export default function OffersPage() {
  useSeo("Offers & Packages", "Honeymoon, long-stay, family and wellness packages at Lūana Kai Resort & Villas, Kauaʻi.");
  return (
    <>
      <PageHero image="/images/gallery-beach.jpg" eyebrow="Offers" title="Packages & Privileges" intro="Book direct for our best rates and exclusive inclusions." />
      <section className="mx-auto max-w-[1240px] space-y-6 px-6 py-24">
        {OFFERS.map((o, i) => (
          <Reveal key={o.slug} delay={0.05 * i} className="grid overflow-hidden rounded-[14px] border border-line md:grid-cols-[1fr_1.2fr]">
            <img src={o.image} alt={o.name} loading="lazy" className="h-full max-h-[340px] w-full object-cover" />
            <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
              <span className="w-fit rounded-full bg-sand px-3 py-1 text-[11px] font-bold text-ink">{o.perk}</span>
              <h2 className="font-display text-[34px] font-light leading-tight">{o.name}</h2>
              <p className="text-mist">{o.description}</p>
              <p className="text-[12px] uppercase tracking-[0.18em]">{o.nights}</p>
              <ButtonLink href={`/book?offer=${o.slug}`} className="mt-2 w-fit">Request this offer</ButtonLink>
            </div>
          </Reveal>
        ))}
        <p className="pt-6 text-center text-[12px] text-mist">Offers subject to availability and blackout dates. Not combinable with other promotions.</p>
      </section>
    </>
  );
}
