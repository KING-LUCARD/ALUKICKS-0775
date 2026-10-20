import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "wouter";
import { SplitHeading } from "../motion";

export function Campaign() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(12% 8% 12% 8%)", "inset(0% 0% 0% 0%)"]);

  return (
    <section ref={ref} className="relative h-[120svh]">
      <motion.div style={{ clipPath: clip }} className="sticky top-0 h-svh overflow-hidden">
        <motion.img style={{ scale, y }} src="/images/campaign/campaign-hero.webp" alt="ALU KICKS Phantom 01 night campaign" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-vanta via-vanta/20 to-vanta/40" />
        <div className="px-gutter relative flex h-full flex-col justify-end pb-16 md:pb-24">
          <p className="label mb-6 text-bone/70">/04 — Campaign · Night Shift</p>
          <SplitHeading className="display text-[clamp(3rem,10vw,11rem)]" lines={["Move like", "nobody's", <span key="c" className="text-infra">watching.</span>]} />
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link to="/product/phantom-01-obsidian" className="btn btn-primary">Shop the look →</Link>
            <span className="label max-w-xs text-bone/70">Phantom 01 Obsidian, shot after midnight on the rooftops of the 11th.</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
