import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "../lib/format";

/** Intro sequence: counter 000→100 then a wipe. Shown once per session. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(() => !sessionStorage.getItem("alukicks.intro"));
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!show) {
      onDone();
      return;
    }
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          sessionStorage.setItem("alukicks.intro", "1");
          setShow(false);
          onDone();
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-vanta p-[var(--gutter)]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="flex justify-between label text-ash">
            <span>ALU KICKS / SS—26</span>
            <span>Loading the showroom</span>
          </div>
          <div className="overflow-hidden">
            <motion.div
              className="display whitespace-nowrap text-[11.5vw] leading-none text-bone"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: EASE }}
            >
              ALU KICKS
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <div className="h-px flex-1 bg-line mr-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-infra" style={{ width: `${n}%` }} />
            </div>
            <span className="display-narrow text-6xl tabular-nums md:text-8xl">{String(n).padStart(3, "0")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
