import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "wouter";
import { Loader2, Lock } from "lucide-react";
import { useStore } from "../lib/store";
import { useCreateOrder } from "../queries/orders";
import { EASE, FREE_SHIPPING_THRESHOLD, SHIPPING, money } from "../lib/format";
import { SplitHeading } from "../components/motion";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useStore();
  const order = useCreateOrder();
  const [form, setForm] = useState({ email: "", name: "", line1: "", city: "", postcode: "", country: "United States", card: "", exp: "", cvc: "" });
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (order.isSuccess) {
    const o = order.data;
    return (
      <section className="px-gutter flex min-h-svh flex-col justify-center pb-20 pt-32">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label text-infra">Order confirmed · {o.number}</motion.p>
        <SplitHeading as="h1" animateOnMount className="display mt-6 text-[clamp(3.5rem,12vw,12rem)]" lines={["You're", <span key="b">moving<span className="text-infra">.</span></span>]} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: EASE }} className="mt-12 grid max-w-3xl gap-8 border-t border-line pt-8 md:grid-cols-3">
          <div>
            <p className="label text-ash">Shipping to</p>
            <p className="mt-2">{o.name}<br />{o.address.line1}<br />{o.address.city} {o.address.postcode}</p>
          </div>
          <div>
            <p className="label text-ash">Items</p>
            <ul className="mt-2 space-y-1">{o.items.map((i) => <li key={i.productId + i.size}>{i.qty}× {i.name} — US {i.size}</li>)}</ul>
          </div>
          <div>
            <p className="label text-ash">Total paid</p>
            <p className="display-narrow mt-2 text-4xl">{money(o.total)}</p>
          </div>
        </motion.div>
        <p className="mt-8 text-ash">A confirmation is on its way to {o.email}.</p>
        <Link to="/shop" className="btn btn-primary mt-10 self-start">Keep shopping →</Link>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="px-gutter flex min-h-[80svh] flex-col items-start justify-center pt-28">
        <p className="label text-ash">Checkout</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,9rem)]">Bag's <span className="outline-text">empty.</span></h1>
        <Link to="/shop" className="btn btn-primary mt-10">Find your pair →</Link>
      </section>
    );
  }

  return (
    <div className="px-gutter pb-28 pt-28 md:pt-36">
      <SplitHeading as="h1" animateOnMount className="display text-[clamp(3rem,8vw,8rem)]" lines={["Checkout"]} />
      <form
        className="mt-14 grid gap-14 md:grid-cols-12"
        onSubmit={(e) => {
          e.preventDefault();
          order.mutate(
            {
              email: form.email,
              name: form.name,
              address: { line1: form.line1, city: form.city, postcode: form.postcode, country: form.country },
              items: lines.map((l) => ({ productId: l.productId, size: l.size, qty: l.qty })),
            },
            { onSuccess: () => clear() },
          );
        }}
      >
        <div className="space-y-14 md:col-span-7">
          <fieldset>
            <legend className="label mb-6 text-infra">01 — Contact</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <input required type="email" placeholder="Email" aria-label="Email" className="field" value={form.email} onChange={set("email")} />
              <input required placeholder="Full name" aria-label="Full name" className="field" value={form.name} onChange={set("name")} minLength={2} />
            </div>
          </fieldset>
          <fieldset>
            <legend className="label mb-6 text-infra">02 — Shipping</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <input required placeholder="Address" aria-label="Address" className="field sm:col-span-2" value={form.line1} onChange={set("line1")} minLength={3} />
              <input required placeholder="City" aria-label="City" className="field" value={form.city} onChange={set("city")} />
              <input required placeholder="Postcode" aria-label="Postcode" className="field" value={form.postcode} onChange={set("postcode")} />
              <select aria-label="Country" className="field sm:col-span-2 bg-vanta" value={form.country} onChange={set("country")}>
                {["United States", "United Kingdom", "France", "Germany", "Japan", "Canada", "Australia"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </fieldset>
          <fieldset>
            <legend className="label mb-2 text-infra">03 — Payment</legend>
            <p className="label mb-6 flex items-center gap-2 text-ash"><Lock size={12} /> Demo mode — no card is charged</p>
            <div className="grid gap-6 sm:grid-cols-4">
              <input placeholder="Card number" aria-label="Card number" inputMode="numeric" className="field sm:col-span-2" value={form.card} onChange={set("card")} />
              <input placeholder="MM / YY" aria-label="MM / YY" className="field" value={form.exp} onChange={set("exp")} />
              <input placeholder="CVC" aria-label="CVC" className="field" value={form.cvc} onChange={set("cvc")} />
            </div>
          </fieldset>
        </div>

        <aside className="md:col-span-5">
          <div className="border border-line bg-carbon p-6 md:sticky md:top-24 md:p-8">
            <p className="label mb-6 text-ash">Order summary</p>
            <ul className="divide-y divide-line">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 py-4">
                  <div className="relative flex h-16 w-20 shrink-0 items-center justify-center bg-graphite p-1.5">
                    <img src={l.image} alt="" className="max-h-full max-w-full object-contain" />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-bone font-mono text-[10px] text-vanta">{l.qty}</span>
                  </div>
                  <div className="flex-1">
                    <p className="display-narrow">{l.name}</p>
                    <p className="label text-ash">{l.colorway} · US {l.size}</p>
                  </div>
                  <p className="font-mono text-sm">{money(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-ash">Subtotal</dt><dd className="font-mono">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ash">Express shipping</dt><dd className="font-mono">{shipping ? money(shipping) : "Free"}</dd></div>
              <div className="flex items-end justify-between border-t border-line pt-4"><dt className="label">Total</dt><dd className="display-narrow text-3xl">{money(subtotal + shipping)}</dd></div>
            </dl>
            <button type="submit" disabled={order.isPending} className="btn btn-primary mt-6 w-full">
              {order.isPending ? <><Loader2 size={16} className="animate-spin" /> Processing</> : <>Place order — {money(subtotal + shipping)}</>}
            </button>
            <AnimatePresence>
              {order.isError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label mt-4 text-infra">{order.error.message}</motion.p>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </form>
    </div>
  );
}
