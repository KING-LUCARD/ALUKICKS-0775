import Lenis from "lenis";
import { useEffect } from "react";
import { useLocation } from "wouter";

let lenis: Lenis | null = null;

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}

export function lockScroll(locked: boolean) {
  if (!lenis) {
    document.body.style.overflow = locked ? "hidden" : "";
    return;
  }
  if (locked) lenis.stop();
  else lenis.start();
}

/** Lenis smooth scrolling + scroll-to-top on navigation. */
export function SmoothScroll() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    scrollToTop(true);
  }, [location]);

  return null;
}
