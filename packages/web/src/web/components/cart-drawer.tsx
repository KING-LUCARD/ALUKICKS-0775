import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Link } from "wouter";
import { Minus, Plus, X } from "lucide-react";
import { useStore } from "../lib/store";
import { EASE, FREE_SHIPPING_THRESHOLD, money } from "../lib/format";
import { lockScroll } from "./smooth-scroll";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, remove, subtotal, count } = useStore();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  useEffect(() => lockScroll(cartOpen), [cartOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-[480px] flex-col border-l border-line bg-carbon"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: EASE }}
            data-lenis-prevent
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <span className="display text-2xl">Bag <span className="text-ash">({count})</span></span>
              <button onClick={() => setCartOpen(false)} aria-label="Close bag" className="p-2 transition hover:rotate-90 duration-500">
                <X size={20} />
              </button>
            </div>

            <div className="border-b border-line px-6 py-4">
              <p className="label text-ash">
                {remaining > 0 ? (
                  <>
                    <span className="text-bone">{money(remaining)}</span> away from free express shipping
                  </>
                ) : (
                  <span className="text-infra">Free express shipping unlocked</span>
                )}
              </p>
              <div className="mt-3 h-px bg-line">
                <motion.div className="h-px bg-infra" animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} transition={{ duration: 0.8, ease: EASE }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                  <p className="display text-5xl text-bone/15">Empty</p>
                  <p className="text-ash">Your bag is waiting for its first pair.</p>
                  <Link to="/shop" className="btn btn-ghost" onClick={() => setCartOpen(false)}>
                    Shop the collection
                  </Link>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="flex gap-4 border-b border-line py-5"
                      >
                        <Link to={`/product/${l.slug}`} onClick={() => setCartOpen(false)} className="flex h-24 w-28 shrink-0 items-center justify-center bg-graphite p-2">
                          <img src={l.image} alt={l.name} className="max-h-full max-w-full object-contain" />
                        </Link>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-4">
                            <div>
                              <p className="display-narrow text-lg">{l.name}</p>
                              <p className="label mt-1 text-ash">{l.colorway} · US {l.size}</p>
                            </div>
                            <p className="font-mono text-sm">{money(l.price * l.qty)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-line">
                              <button className="p-2 hover:text-infra" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                              <span className="w-8 text-center font-mono text-sm">{l.qty}</span>
                              <button className="p-2 hover:text-infra" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                            </div>
                            <button className="label link-u text-ash hover:text-bone" onClick={() => remove(l.key)}>Remove</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-6">
                <div className="mb-5 flex items-end justify-between">
                  <span className="label text-ash">Subtotal</span>
                  <span className="display-narrow text-3xl">{money(subtotal)}</span>
                </div>
                <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary w-full">
                  Checkout →
                </Link>
                <p className="label mt-4 text-center text-ash">Taxes calculated at checkout · 30-day returns</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
