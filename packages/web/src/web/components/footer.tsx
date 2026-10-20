import { Link } from "wouter";
import { NewsletterForm } from "./newsletter-form";

const COLS = [
  { title: "Shop", links: [["All sneakers", "/shop"], ["Running", "/shop?c=Running"], ["Court", "/shop?c=Court"], ["Trail", "/shop?c=Trail"], ["High-Top", "/shop?c=High-Top"]] },
  { title: "ALU KICKS", links: [["Story", "/story"], ["Phantom 01", "/product/phantom-01-obsidian"], ["Void Runner", "/product/void-runner-infra"]] },
  { title: "Help", links: [["Shipping", "/story"], ["Returns", "/story"], ["Size guide", "/story"], ["Contact", "/story"]] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-vanta pt-20">
      <div className="px-gutter grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label text-infra">Drop access</p>
          <p className="display mt-4 text-4xl md:text-5xl">Be first.<br />Or be late.</p>
          <p className="mt-4 max-w-sm text-ash">Early access to every release, restock alerts and members-only colourways. No noise.</p>
          <NewsletterForm className="mt-8 max-w-md" />
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-6 md:col-start-7">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="label text-ash">{c.title}</p>
              <ul className="mt-5 space-y-3">
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="link-u text-sm text-bone/80 hover:text-bone">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="px-gutter mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 label text-ash">
        <span>© 2026 ALU KICKS Footwear. More than a shoe. A statement.</span>
        <span className="flex gap-6">
          <a className="link-u hover:text-bone" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a className="link-u hover:text-bone" href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
          <Link className="link-u hover:text-bone" to="/story">Privacy</Link>
        </span>
      </div>
      <div aria-hidden className="display pointer-events-none select-none px-gutter whitespace-nowrap text-[12.5vw] leading-[0.8] text-bone/[0.04] -mb-[3vw]">
        ALU KICKS
      </div>
    </footer>
  );
}
