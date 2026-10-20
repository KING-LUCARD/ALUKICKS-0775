import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "wouter";
import { SplitHeading } from "../motion";

function Frame({ src, alt, speed, className, caption, to }: { src: string; alt: string; speed: number; className?: string; caption: string; to: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}px`, `${-speed * 100}px`]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <Link to={to} data-cursor="Shop" className="group block">
        <div className="relative overflow-hidden">
          <motion.img style={{ y: imgY, scale: 1.18 }} src={src} alt={alt} loading="lazy" className="aspect-[3/4] w-full object-cover grayscale-[30%] transition duration-700 group-hover:grayscale-0" />
        </div>
        <p className="label mt-3 flex justify-between text-ash">
          <span>{caption}</span>
          <span className="text-bone opacity-0 transition group-hover:opacity-100">Shop →</span>
        </p>
      </Link>
    </motion.div>
  );
}

export function Lookbook() {
  return (
    <section className="px-gutter relative py-28 md:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label mb-4 text-ash">/05 — Lookbook SS—26</p>
          <SplitHeading className="display text-[clamp(2.6rem,6vw,6.5rem)]" lines={["Worn", "in the", <span key="c" className="outline-text">wild.</span>]} />
          <p className="mt-8 max-w-sm text-ash">Concrete, tunnels and late light. ALU KICKS is photographed where it's worn — never on a pedestal.</p>
        </div>
        <Frame className="md:col-span-4 md:col-start-8 md:mt-10" src="/images/campaign/look-1.webp" alt="Phantom 01 Bone on concrete steps" speed={0.4} caption="Look 01 — Phantom 01 Bone" to="/product/phantom-01-bone" />
        <Frame className="md:col-span-4 md:col-start-2 md:-mt-10" src="/images/campaign/macro.webp" alt="Phantom 01 knit and foam macro" speed={-0.3} caption="Detail — Monoknit / WAVEFORM" to="/product/phantom-01-obsidian" />
        <Frame className="md:col-span-5 md:col-start-7 md:mt-32" src="/images/campaign/look-2.webp" alt="Eclipse High Noir Ice in a tunnel" speed={0.6} caption="Look 02 — Eclipse High Noir / Ice" to="/product/eclipse-high-noir-ice" />
      </div>
    </section>
  );
}
