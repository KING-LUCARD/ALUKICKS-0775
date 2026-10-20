import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "../lib/store";
import { EASE } from "../lib/format";
import { lockScroll } from "./smooth-scroll";

const LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?c=Running", label: "Running" },
  { to: "/product/phantom-01-obsidian", label: "Phantom 01" },
  { to: "/story", label: "Story" },
];

export function Nav() {
  const { count, setCartOpen } = useStore();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !open);
    setScrolled(y > 40);
  });

  useEffect(() => setOpen(false), [location]);
  useEffect(() => lockScroll(open), [open]);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled && !open ? "bg-vanta/70 backdrop-blur-xl border-b border-line" : ""}`}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="px-gutter flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="display whitespace-nowrap text-xl tracking-tight md:text-[26px]" aria-label="ALU KICKS home">
            ALU KICKS<span className="text-infra">.</span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="label link-u pb-1 text-bone/80 hover:text-bone">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <span className="label hidden items-center gap-2 text-ash lg:flex">
              <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-infra" /> Drop 04 live
            </span>
            <button onClick={() => setCartOpen(true)} className="label group flex items-center gap-2" aria-label="Open bag">
              <span className="link-u pb-1">Bag</span>
              <motion.span
                key={count}
                initial={{ scale: 1.6, backgroundColor: "#EDEAE3" }}
                animate={{ scale: 1, backgroundColor: count ? "#FF4A1C" : "#1E1E1E" }}
                className="flex h-6 min-w-6 items-center justify-center px-1.5 text-[11px] text-vanta"
                style={{ color: count ? "#0A0A0A" : "#EDEAE3" }}
              >
                {count}
              </motion.span>
            </button>
            <button className="relative h-6 w-7 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              <motion.span className="absolute left-0 top-1.5 h-px w-full bg-bone" animate={open ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }} />
              <motion.span className="absolute left-0 top-[15px] h-px w-full bg-bone" animate={open ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-vanta px-gutter pb-10 pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <div key={l.label} className="overflow-hidden">
                  <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.8, ease: EASE }}>
                    <Link to={l.to} className="display block text-[13vw]">
                      {l.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <div className="label flex justify-between text-ash">
              <span>Built to move.</span>
              <span>SS—26</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
