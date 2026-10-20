import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { Product } from "../types/product";
import { EASE } from "../lib/format";
import { Tilt } from "./tilt";

/**
 * Showroom viewer: drag horizontally (or use the thumbnails / arrow keys)
 * to rotate through the product's views.
 */
export function AngleViewer({ product }: { product: Product }) {
  const views = product.views;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const start = useRef<number | null>(null);
  const reduce = useReducedMotion();

  const go = (next: number) => {
    const n = (next + views.length) % views.length;
    setDir(next > i ? 1 : -1);
    setI(n);
  };
  const v = views[i];

  return (
    <div className="relative">
      <button
        type="button"
        className="relative flex aspect-[5/4] w-full select-none items-center justify-center overflow-hidden bg-carbon touch-pan-y md:aspect-auto md:h-[78svh]"
        data-cursor="Drag"
        aria-label={`Rotate product view — ${v.label}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(i + 1);
          if (e.key === "ArrowLeft") go(i - 1);
        }}
        onPointerDown={(e) => {
          start.current = e.clientX;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (start.current === null) return;
          const dx = e.clientX - start.current;
          if (Math.abs(dx) > 70) {
            go(i + (dx < 0 ? 1 : -1));
            start.current = e.clientX;
          }
        }}
        onPointerUp={() => (start.current = null)}
        onPointerCancel={() => (start.current = null)}
      >
        <div className="absolute inset-0" style={{ background: `radial-gradient(55% 50% at 50% 55%, ${product.accent}33, transparent 70%)` }} />
        <div className="grid-lines absolute inset-0 opacity-60" />
        <span aria-hidden className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[16vw] leading-none text-bone/[0.04] md:text-[11vw]">
          {product.model.split(" ")[0]}
        </span>

        <Tilt max={8} className="relative h-full w-full">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={i}
              custom={dir}
              className="absolute inset-0 flex items-center justify-center p-[8%]"
              initial={{ opacity: 0, x: dir * 120, rotateY: dir * 35, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -120, rotateY: dir * -35, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <motion.img
                src={v.src}
                alt={`${product.model} ${product.colorway} — ${v.label}`}
                draggable={false}
                className="shoe-shadow max-h-full max-w-full object-contain"
                style={{ scaleX: v.mirror ? -1 : 1, scale: v.zoom ?? 1, transformOrigin: v.zoom ? "30% 60%" : "center" }}
                animate={reduce ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </AnimatePresence>
        </Tilt>

        <div className="label pointer-events-none absolute left-4 top-4 text-ash">{product.sku}</div>
        <div className="label pointer-events-none absolute right-4 top-4 text-ash">
          {String(i + 1).padStart(2, "0")} / {String(views.length).padStart(2, "0")} — {v.label}
        </div>
        <div className="label pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-ash">← Drag to rotate →</div>
      </button>

      <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${views.length}, minmax(0, 1fr))` }}>
        {views.map((view, idx) => (
          <button
            key={idx}
            onClick={() => go(idx)}
            className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden border bg-carbon p-3 transition-colors ${idx === i ? "border-bone" : "border-transparent hover:border-line"}`}
            aria-label={view.label}
          >
            <img src={view.src} alt="" className="max-h-full max-w-full object-contain" style={{ transform: `${view.mirror ? "scaleX(-1)" : ""} scale(${view.zoom ? 1.6 : 1})` }} />
            {idx === i && <motion.span layoutId="thumb-bar" className="absolute bottom-0 left-0 h-[2px] w-full bg-infra" />}
          </button>
        ))}
      </div>
    </div>
  );
}
