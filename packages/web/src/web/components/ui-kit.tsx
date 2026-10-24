import { motion, type HTMLMotionProps } from "motion/react";
import { Link } from "wouter";
import { cn } from "../lib/utils";

export function Reveal({ className, delay = 0, children, ...rest }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({ title, eyebrow, intro, className }: { title: string; eyebrow?: string; intro?: string; className?: string }) {
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="font-display text-[34px] font-light leading-tight md:text-[44px]">{title}</h2>
      <div className="mx-auto mt-6 h-px w-12 bg-bone/35" />
      {intro && <p className="mt-6 text-[15px] text-mist">{intro}</p>}
    </Reveal>
  );
}

type BtnProps = { href: string; children: React.ReactNode; variant?: "solid" | "glass" | "outline"; className?: string };
export function ButtonLink({ href, children, variant = "solid", className }: BtnProps) {
  return (
    <Link
      to={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-[13px] font-semibold tracking-wide transition-all duration-300",
        variant === "solid" && "bg-bone text-ink hover:bg-white",
        variant === "glass" && "glass text-bone hover:bg-white/15",
        variant === "outline" && "border border-line text-bone hover:border-bone/60",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center rounded-[8px] border border-line px-4 py-2.5 text-[13px] font-medium text-bone/90", className)}>
      {children}
    </span>
  );
}

export function PageHero({ image, eyebrow, title, intro }: { image: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden">
      <motion.img
        src={image}
        alt=""
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-ink" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 text-center">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="eyebrow mb-5">
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1 }}
          className="font-display text-5xl font-light leading-[1.02] md:text-7xl"
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.9 }} className="mx-auto mt-6 max-w-xl text-mist">
            {intro}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export function ImageCard({ image, title, text, meta, href }: { image: string; title: string; text: string; meta?: string; href?: string }) {
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        {meta && <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide">{meta}</span>}
      </div>
      <h3 className="mt-5 font-display text-[20px] uppercase tracking-wide">{title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-mist">{text}</p>
    </>
  );
  return href ? (
    <Link to={href} className="group block">
      {inner}
    </Link>
  ) : (
    <div className="group">{inner}</div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <span className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)} />;
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
