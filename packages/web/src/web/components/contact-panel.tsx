import { useState } from "react";
import { Instagram, Facebook, Check } from "lucide-react";
import { RESORT } from "../../shared/resort";
import { useCreateEnquiry } from "../queries/public";
import { Reveal, Spinner } from "./ui-kit";

export function ContactPanel() {
  const enquiry = useCreateEnquiry();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <Reveal className="panel-gradient grain relative mx-auto max-w-[1240px] overflow-hidden rounded-[16px] px-6 py-14 md:px-12 md:py-16">
      <div className="relative grid gap-14 md:grid-cols-2">
        <div>
          <h2 className="font-display text-[30px] font-light">Contact Us</h2>
          <div className="mt-5 h-px w-10 bg-bone/40" />
          <p className="mt-6 max-w-sm text-[14px] text-mist">Our reservations and guest experience team is here 7am – 10pm Hawaiʻi time, every day of the year.</p>
          <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-bone/80">Contact details</p>
          <ul className="mt-4 space-y-1.5 text-[13px]">
            <li>{RESORT.address.split(",")[0]},</li>
            <li>Hanalei, Kauaʻi, HI 96714</li>
            <li><a href={`tel:${RESORT.phone.replace(/[^+\d]/g, "")}`} className="hover:text-sand">{RESORT.phone}</a></li>
            <li><a href={`mailto:${RESORT.email}`} className="hover:text-sand">{RESORT.email}</a></li>
          </ul>
          <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-bone/80">Follow us</p>
          <ul className="mt-4 space-y-1.5 text-[13px]">
            <li className="flex items-center gap-2"><Instagram size={14} /> {RESORT.instagram}</li>
            <li className="flex items-center gap-2"><Facebook size={14} /> {RESORT.facebook}</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-[30px] font-light">Enquiry Form</h2>
          <div className="mt-5 h-px w-10 bg-bone/40" />
          <p className="mt-6 max-w-sm text-[14px] text-mist">Weddings, celebrations, group stays or a simple question — we'll reply within a few hours.</p>
          {sent ? (
            <div className="mt-10 flex items-start gap-3 rounded-xl border border-line bg-white/[0.03] p-5">
              <Check className="mt-0.5 text-sand" size={18} />
              <div>
                <p className="font-semibold">Mahalo, {form.name.split(" ")[0]}.</p>
                <p className="mt-1 text-[13px] text-mist">Your message is with our team. We'll be in touch at {form.email}.</p>
              </div>
            </div>
          ) : (
            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                enquiry.mutate({ ...form, subject: form.subject || undefined }, { onSuccess: () => setSent(true) });
              }}
            >
              <input className="field" aria-label="What's your name?" placeholder="What's your name?" required minLength={2} value={form.name} onChange={set("name")} />
              <input className="field" type="email" aria-label="Your email address?" placeholder="Your email address?" required value={form.email} onChange={set("email")} />
              <input className="field" aria-label="Subject (optional)" placeholder="Subject (optional)" value={form.subject} onChange={set("subject")} />
              <textarea className="field min-h-[96px] resize-y" aria-label="How can we help?" placeholder="How can we help?" required minLength={5} value={form.message} onChange={set("message")} />
              {enquiry.error && <p className="text-[12px] text-destructive">{enquiry.error.message}</p>}
              <button disabled={enquiry.isPending} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-bone py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition hover:bg-white disabled:opacity-60">
                {enquiry.isPending && <Spinner />} Send enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </Reveal>
  );
}
