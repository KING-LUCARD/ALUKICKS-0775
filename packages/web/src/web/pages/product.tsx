import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Check, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useProduct } from "../queries/products";
import { useStore } from "../lib/store";
import { EASE, money } from "../lib/format";
import { AngleViewer } from "../components/angle-viewer";
import { ProductCard } from "../components/product-card";
import { Reveal, SplitHeading } from "../components/motion";
import NotFound from "./not-found";

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-5 text-left">
        <span className="label">{title}</span>
        {open ? <Minus size={14} /> : <Plus size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
            <div className="pb-6 text-sm leading-relaxed text-ash">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useProduct(slug);
  const { add, wishlist, toggleWish } = useStore();
  const [size, setSize] = useState<number | null>(null);
  const [shake, setShake] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSize(null);
    setAdded(false);
  }, [slug]);

  if (isError) return <NotFound />;
  if (isLoading || !data) {
    return (
      <div className="px-gutter grid gap-10 pt-28 md:grid-cols-12">
        <div className="h-[70svh] animate-pulse bg-carbon md:col-span-7" />
        <div className="space-y-4 md:col-span-5">
          <div className="h-16 w-3/4 animate-pulse bg-carbon" />
          <div className="h-6 w-1/3 animate-pulse bg-carbon" />
          <div className="h-48 animate-pulse bg-carbon" />
        </div>
      </div>
    );
  }

  const { product: p, colorways, related } = data;
  const wished = wishlist.includes(p.id);

  const handleAdd = () => {
    if (size === null) {
      setShake((n) => n + 1);
      return;
    }
    add(p, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="pt-20 md:pt-24">
      <div className="px-gutter label flex gap-2 py-4 text-ash">
        <Link to="/shop" className="link-u hover:text-bone">Shop</Link> / <Link to={`/shop?c=${p.category}`} className="link-u hover:text-bone">{p.category}</Link> / <span className="text-bone">{p.model}</span>
      </div>

      <section className="px-gutter grid gap-10 md:grid-cols-12 md:gap-12">
        <motion.div key={p.slug} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }} className="md:col-span-7">
          <AngleViewer product={p} />
        </motion.div>

        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
              {p.badge && <span className={`label px-2 py-1 text-[10px] ${p.badge === "Limited" ? "bg-infra text-vanta" : "border border-bone/30"}`}>{p.badge}</span>}
              <span className="label text-ash">{p.category} · Released {new Date(p.release).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            </motion.div>
            <SplitHeading key={p.slug} as="h1" animateOnMount delay={0.1} className="display mt-5 text-[clamp(2.8rem,5.5vw,5.5rem)]" lines={[p.model, <span key="c" className="text-ash">{p.colorway}</span>]} />
            <p className="display-narrow mt-6 text-3xl">{money(p.price)}</p>
            <p className="mt-5 max-w-md leading-relaxed text-bone/75">{p.description}</p>

            {colorways.length > 1 && (
              <div className="mt-8">
                <p className="label mb-3 text-ash">Colourway — {p.colorway}</p>
                <div className="flex gap-2">
                  {colorways.map((c) => (
                    <Link key={c.slug} to={`/product/${c.slug}`} className={`flex h-16 w-20 items-center justify-center border bg-carbon p-1.5 transition-colors ${c.slug === p.slug ? "border-bone" : "border-line hover:border-bone/40"}`} aria-label={c.colorway}>
                      <img src={c.image} alt="" className="max-h-full max-w-full object-contain" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <div className="label mb-3 flex justify-between text-ash">
                <span>Select size (US)</span>
                <a href="#size-guide" className="link-u hover:text-bone">Size guide</a>
              </div>
              <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.45 }} className="grid grid-cols-5 gap-1 sm:grid-cols-7">
                {p.sizes.map((s) => {
                  const out = p.soldOut.includes(s);
                  return (
                    <button
                      key={s}
                      disabled={out}
                      onClick={() => setSize(s)}
                      className={`font-mono relative border py-3.5 text-xs transition-colors ${
                        out ? "cursor-not-allowed border-line text-bone/20 line-through" : size === s ? "border-bone bg-bone text-vanta" : "border-line hover:border-bone/50"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </motion.div>
              <AnimatePresence>
                {shake > 0 && size === null && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="label mt-3 text-infra">
                    Pick a size first.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={handleAdd} className="btn btn-primary flex-1" aria-label={`Add ${p.model} ${p.colorway} to bag`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={added ? "ok" : "add"} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                    {added ? <><Check size={16} /> Added to bag</> : <>Add to bag — {money(p.price)}</>}
                  </motion.span>
                </AnimatePresence>
              </button>
              <button onClick={() => toggleWish(p.id)} className="btn btn-ghost w-14 px-0" aria-label="Wishlist">
                <Heart size={18} fill={wished ? "#FF4A1C" : "transparent"} stroke={wished ? "#FF4A1C" : "currentColor"} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-px border border-line bg-line text-center">
              {[
                [Truck, "Free express over $250"],
                [RotateCcw, "30-day returns"],
                [ShieldCheck, "Authenticity guaranteed"],
              ].map(([Icon, t], idx) => {
                const I = Icon as typeof Truck;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 bg-vanta px-2 py-4">
                    <I size={16} className="text-ash" />
                    <span className="label text-[10px] text-ash">{t as string}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-line">
              <Accordion title="Specifications" defaultOpen>
                <dl className="grid grid-cols-2 gap-y-3">
                  {p.specs.map((s) => (
                    <div key={s.label} className="contents">
                      <dt className="label text-ash">{s.label}</dt>
                      <dd className="text-bone/90">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
              <Accordion title="Size guide">
                <p id="size-guide">ALU KICKS runs true to size. Between sizes or wide feet? Go half a size up. Phantom 01 and Void Runner have a performance fit — snug through the midfoot.</p>
              </Accordion>
              <Accordion title="Shipping & returns">
                <p>Express shipping in 1–3 business days. Free over $250. Unworn pairs can be returned within 30 days in the original box.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="px-gutter mt-28 border-t border-line pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="label mb-4 text-ash">Engineering</p>
            <SplitHeading className="display text-[clamp(2.4rem,4.5vw,4.5rem)]" lines={[p.tagline]} />
          </div>
          <div className="grid gap-px bg-line md:col-span-8 md:grid-cols-3">
            {p.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1} className="bg-vanta p-6 md:p-8">
                <p className="label text-infra">/{String(i + 1).padStart(2, "0")}</p>
                <p className="display-narrow mt-8 text-2xl">{f.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ash">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* related */}
      <section className="px-gutter py-28">
        <div className="mb-12 flex items-end justify-between">
          <SplitHeading className="display text-[clamp(2.4rem,5vw,5rem)]" lines={["Complete", <span key="b" className="outline-text">the rotation.</span>]} />
          <Link to="/shop" className="label link-u hidden text-ash hover:text-bone md:block">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r, i) => (
            <ProductCard key={r.id} product={r} index={i} />
          ))}
        </div>
      </section>

      {/* mobile sticky add */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-vanta/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex-1">
          <p className="display-narrow text-base leading-tight">{p.model}</p>
          <p className="label text-ash">{size ? `US ${size}` : "Select size"} · {money(p.price)}</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary h-12 px-5">{added ? "Added" : "Add to bag"}</button>
      </div>
    </div>
  );
}
