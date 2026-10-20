import { useProducts } from "../queries/products";
import { useIntro } from "../lib/intro";
import { Hero } from "../components/home/hero";
import { Manifesto } from "../components/home/manifesto";
import { CollectionRail } from "../components/home/collection-rail";
import { Anatomy } from "../components/home/anatomy";
import { Campaign } from "../components/home/campaign";
import { Lookbook } from "../components/home/lookbook";
import { NextDrop } from "../components/home/next-drop";

export default function Index() {
  const { data: products, isLoading } = useProducts();
  const ready = useIntro();

  if (isLoading || !products) {
    return (
      <div className="flex h-svh items-center justify-center">
        <span className="label animate-pulse text-ash">Loading showroom…</span>
      </div>
    );
  }

  const flagship = products.find((p) => p.slug === "phantom-01-obsidian") ?? products[0];
  const secret = products.find((p) => p.slug === "eclipse-high-noir-ice") ?? products[0];

  return (
    <>
      <Hero products={products} ready={ready} />
      <Manifesto />
      <CollectionRail products={products} />
      <Anatomy product={flagship} />
      <Campaign />
      <Lookbook />
      <NextDrop product={secret} />
    </>
  );
}
