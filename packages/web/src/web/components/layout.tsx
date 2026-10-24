import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Instagram, Facebook, ArrowUp } from "lucide-react";
import { RESORT } from "../../shared/resort";
import { cn } from "../lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Stay" },
  { href: "/dining", label: "Dine" },
  { href: "/spa", label: "Spa" },
  { href: "/experiences", label: "Explore" },
  { href: "/offers", label: "Offers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("font-display text-[22px] font-light tracking-tight", className)} aria-label="Lūana Kai home">
      Lūana<span className="text-sand">.</span>Kai
    </Link>
  );
}

export function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [location]);

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition-all duration-500", scrolled ? "bg-ink/70 backdrop-blur-md" : "bg-transparent")}>
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-4 px-5 md:px-8">
        <Wordmark />
        <nav className="glass hidden items-center gap-1 rounded-[14px] p-1.5 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              to={n.href}
              className={cn(
                "rounded-[10px] px-4 py-2 text-[13px] font-medium transition-colors",
                isActive(n.href) ? "bg-white/12 text-bone" : "text-bone/75 hover:text-bone",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/book" className="glass hidden rounded-[12px] px-5 py-2.5 text-[13px] font-semibold transition hover:bg-white/15 sm:inline-flex">
            Reserve
          </Link>
          <button className="glass rounded-[12px] p-2.5 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mb-4 rounded-2xl border border-line bg-ink/95 p-3 backdrop-blur-xl lg:hidden"
          >
            {[...NAV, { href: "/book", label: "Reserve" }].map((n) => (
              <Link key={n.href} to={n.href} className={cn("block rounded-xl px-4 py-3 font-display text-xl font-light", isActive(n.href) ? "bg-white/8 text-sand" : "")}>
                {n.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="eyebrow mb-4">Visit</p>
          <p className="font-display text-2xl font-light leading-snug">
            {RESORT.address.split(",")[0]}
            <br />
            Hanalei, Kauaʻi, HI 96714
          </p>
          <p className="mt-4 text-sm text-mist">{RESORT.airport}</p>
        </div>
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-bone/85">
            <li><a href={`tel:${RESORT.phone.replace(/[^+\d]/g, "")}`}>{RESORT.phone}</a></li>
            <li><a href={`mailto:${RESORT.email}`}>{RESORT.email}</a></li>
            <li className="flex items-center gap-2 pt-2"><Instagram size={14} /> {RESORT.instagram}</li>
            <li className="flex items-center gap-2"><Facebook size={14} /> {RESORT.facebook}</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-bone/85">
            {NAV.slice(1).map((n) => (
              <li key={n.href}><Link to={n.href} className="hover:text-sand">{n.label}</Link></li>
            ))}
            <li><Link to="/book" className="hover:text-sand">Reserve</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl justify-end px-6">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.2em] text-mist hover:text-bone">
          Back to top <ArrowUp size={12} />
        </button>
      </div>
      <div className="select-none px-4 pt-10 text-center font-display font-light leading-[0.85] tracking-[-0.03em]" aria-hidden>
        <span className="block text-[21vw] md:text-[18vw]">
          Lūana<span className="text-sand">.</span>Kai
        </span>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-6 py-6 text-[11px] text-mist sm:flex-row">
        <span>© {new Date().getFullYear()} Lūana Kai Resort & Villas · Hanalei Bay, Kauaʻi</span>
        <span className="flex gap-4">
          <Link to="/contact">Privacy</Link>
          <Link to="/admin">Staff</Link>
        </span>
      </div>
    </footer>
  );
}

export function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}
