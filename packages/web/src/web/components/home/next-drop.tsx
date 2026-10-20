import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import { NewsletterForm } from "../newsletter-form";
import { SplitHeading } from "../motion";

const DROP_DATE = new Date("2026-11-14T10:00:00Z");

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export function NextDrop({ product }: { product: Product }) {
  const t = useCountdown(DROP_DATE);
  const [reveal, setReveal] = useState(false);

  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-36">
      <div className="px-gutter grid items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label mb-4 flex items-center gap-2 text-infra">
            <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-infra" /> /06 — Next drop · Classified
          </p>
          <SplitHeading className="display text-[clamp(2.4rem,4.8vw,5.2rem)]" lines={["Drop 05.", <span key="b" className="text-ash">Members first.</span>]} />
          <div className="mt-10 grid grid-cols-4 border-y border-line">
            {(["d", "h", "m", "s"] as const).map((k) => (
              <div key={k} className="border-r border-line py-5 last:border-r-0">
                <p className="display-narrow text-5xl tabular-nums md:text-6xl">{String(t[k]).padStart(2, "0")}</p>
                <p className="label mt-2 text-ash">{{ d: "Days", h: "Hours", m: "Min", s: "Sec" }[k]}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-sm text-ash">Get the drop link 24 hours before everyone else. One email per release. That's the deal.</p>
          <NewsletterForm className="mt-6 max-w-md" />
        </div>

        <button
          type="button"
          className="relative block w-full text-left md:col-span-7"
          onPointerEnter={() => setReveal(true)}
          onPointerLeave={() => setReveal(false)}
          onClick={() => setReveal((v) => !v)}
          aria-pressed={reveal}
          data-cursor={reveal ? "Hidden" : "Reveal"}
        >
          <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${product.accent}45, transparent 70%)` }} />
          <motion.img
            src={product.image}
            alt="Unreleased silhouette"
            animate={{
              filter: reveal
                ? "brightness(1) drop-shadow(0px 0px 0px rgba(237,234,227,0))"
                : "brightness(0) drop-shadow(0px 0px 1.5px rgba(237,234,227,0.55))", rotate: reveal ? -8 : -4, scale: reveal ? 1.04 : 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[720px]"
            loading="lazy"
          />
          <span className="label mt-6 block text-center text-ash">{reveal ? "Eclipse High — Noir / Ice. Members colourway. You didn't see this." : "Hover to declassify"}</span>
        </button>
      </div>
    </section>
  );
}
