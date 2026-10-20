/**
 * ALU KICKS product catalog.
 * Single source of truth for products. To add a sneaker: drop a transparent
 * .webp cutout into public/images/products/ and append an entry below.
 * Later this can be moved into the database without changing the API shape.
 */

export type Category = "Running" | "Lifestyle" | "Court" | "Trail" | "High-Top";
export type ColorFamily = "Black" | "White" | "Grey" | "Red" | "Green" | "Blue";

export interface ProductView {
  src: string;
  label: string;
  /** mirror the image to fake the medial side */
  mirror?: boolean;
  /** zoom factor for detail crops */
  zoom?: number;
}

export interface Product {
  id: string;
  slug: string;
  model: string;
  colorway: string;
  category: Category;
  colorFamily: ColorFamily;
  price: number;
  badge?: "New" | "Limited" | "Restock" | "Members";
  accent: string;
  tagline: string;
  description: string;
  image: string;
  views: ProductView[];
  sizes: number[];
  soldOut: number[];
  specs: { label: string; value: string }[];
  features: { title: string; body: string }[];
  release: string;
  sku: string;
}

const SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

const img = (n: string) => `/images/products/${n}.webp`;
const stdViews = (n: string): ProductView[] => [
  { src: img(n), label: "Lateral" },
  { src: img(n), label: "Medial", mirror: true },
  { src: img(n), label: "Detail", zoom: 1.9 },
];

export const catalog: Product[] = [
  {
    id: "vn-001",
    slug: "phantom-01-obsidian",
    model: "Phantom 01",
    colorway: "Obsidian",
    category: "Running",
    colorFamily: "Black",
    price: 285,
    badge: "New",
    accent: "#FF4A1C",
    tagline: "Silence, engineered.",
    description:
      "The flagship. A seamless engineered-knit upper fused to our WAVEFORM foam — a sculpted midsole that compresses on landing and snaps back on toe-off. Triple black, cut with a single line of Infra.",
    image: img("phantom-obsidian"),
    views: [
      { src: img("phantom-obsidian"), label: "Lateral" },
      { src: img("phantom-obsidian-34"), label: "3/4" },
      { src: img("phantom-obsidian-back"), label: "Heel" },
      { src: img("phantom-obsidian-top"), label: "Top" },
    ],
    sizes: SIZES,
    soldOut: [6, 13],
    specs: [
      { label: "Weight", value: "248 g / US 9" },
      { label: "Drop", value: "8 mm" },
      { label: "Upper", value: "Engineered knit, TPU yarn" },
      { label: "Midsole", value: "WAVEFORM supercritical foam" },
      { label: "Outsole", value: "Infra-line rubber" },
    ],
    features: [
      { title: "WAVEFORM Foam", body: "Supercritical foam sculpted into a flowing sidewall — 72% energy return." },
      { title: "Monoknit Upper", body: "One-piece engineered knit zoned for lockdown at the midfoot and breathability at the toe." },
      { title: "Infra Heel Tab", body: "A pull loop and outsole line in signature Infra — the only colour it needs." },
    ],
    release: "2026-09-12",
    sku: "AK-PH01-001",
  },
  {
    id: "vn-002",
    slug: "phantom-01-bone",
    model: "Phantom 01",
    colorway: "Bone",
    category: "Running",
    colorFamily: "White",
    price: 285,
    accent: "#C8B89A",
    tagline: "Quiet luxury in motion.",
    description:
      "Phantom 01 rendered in tonal bone knit over an ivory WAVEFORM midsole, grounded by a gum outsole. Made to be worn from the track to the gallery.",
    image: img("phantom-bone"),
    views: stdViews("phantom-bone"),
    sizes: SIZES,
    soldOut: [7, 7.5],
    specs: [
      { label: "Weight", value: "252 g / US 9" },
      { label: "Drop", value: "8 mm" },
      { label: "Upper", value: "Engineered knit, tonal overlays" },
      { label: "Midsole", value: "WAVEFORM supercritical foam" },
      { label: "Outsole", value: "Natural gum rubber" },
    ],
    features: [
      { title: "WAVEFORM Foam", body: "The same sculpted cushioning as the flagship, in an ivory finish." },
      { title: "Gum Outsole", body: "Natural gum rubber for grip and a warm contrast." },
      { title: "Tonal Knit", body: "Bone-on-cream yarns that shift subtly in daylight." },
    ],
    release: "2026-09-12",
    sku: "AK-PH01-002",
  },
  {
    id: "vn-003",
    slug: "void-runner-infra",
    model: "Void Runner",
    colorway: "Infra",
    category: "Running",
    colorFamily: "Red",
    price: 320,
    badge: "Limited",
    accent: "#FF3B1F",
    tagline: "Zero to everything.",
    description:
      "Our most aggressive racer. A translucent Infra mesh caged in skeletal TPU, sitting on a tall rocker midsole with a full-length carbon plate. Built for personal records — and for being seen.",
    image: img("void-infra"),
    views: stdViews("void-infra"),
    sizes: SIZES,
    soldOut: [8, 10, 12],
    specs: [
      { label: "Weight", value: "214 g / US 9" },
      { label: "Drop", value: "6 mm" },
      { label: "Upper", value: "Translucent mono-mesh, TPU cage" },
      { label: "Midsole", value: "Dual-density foam + carbon plate" },
      { label: "Stack", value: "39 / 33 mm" },
    ],
    features: [
      { title: "Carbon Plate", body: "Full-length, spoon-shaped plate for propulsive toe-off." },
      { title: "Rocker Geometry", body: "Aggressive forefoot rocker keeps you rolling at pace." },
      { title: "Skeletal Cage", body: "Welded TPU ribs lock the foot without added weight." },
    ],
    release: "2026-10-03",
    sku: "AK-VR01-003",
  },
  {
    id: "vn-004",
    slug: "eclipse-high-noir-ice",
    model: "Eclipse High",
    colorway: "Noir / Ice",
    category: "High-Top",
    colorFamily: "Black",
    price: 345,
    badge: "Members",
    accent: "#8EC5FF",
    tagline: "Light from below.",
    description:
      "Glossy patent and matte leather above, a frosted ice crystal sole below. Eclipse High is a statement silhouette with a sculpted collar and icy piping that catches every light.",
    image: img("eclipse-ice"),
    views: stdViews("eclipse-ice"),
    sizes: SIZES,
    soldOut: [9, 9.5],
    specs: [
      { label: "Weight", value: "498 g / US 9" },
      { label: "Upper", value: "Patent + nappa leather" },
      { label: "Sole", value: "Frosted translucent TPU" },
      { label: "Collar", value: "Sculpted memory-foam" },
      { label: "Lining", value: "Perforated leather" },
    ],
    features: [
      { title: "Ice Sole", body: "Frosted translucent cupsole with an internal crystal lattice." },
      { title: "Patent Finish", body: "Mirror-gloss panels contrast hand-finished matte leather." },
      { title: "Sculpted Collar", body: "Memory-foam padding moulds to the ankle." },
    ],
    release: "2026-08-21",
    sku: "AK-EH01-004",
  },
  {
    id: "vn-005",
    slug: "axis-low-chrome",
    model: "Axis Low",
    colorway: "Chrome",
    category: "Court",
    colorFamily: "White",
    price: 240,
    accent: "#BFC4CC",
    tagline: "Reflect everything.",
    description:
      "A minimal court silhouette in full-grain white leather, interrupted by liquid-chrome panels at the heel and quarter. Clean enough for anything; sharp enough to stand apart.",
    image: img("axis-chrome"),
    views: stdViews("axis-chrome"),
    sizes: SIZES,
    soldOut: [],
    specs: [
      { label: "Weight", value: "410 g / US 9" },
      { label: "Upper", value: "Full-grain leather, chrome PU" },
      { label: "Sole", value: "Stitched rubber cupsole" },
      { label: "Lining", value: "Calf leather" },
      { label: "Made in", value: "Portugal" },
    ],
    features: [
      { title: "Liquid Chrome", body: "Mirror-finish heel and quarter panels." },
      { title: "Stitched Cupsole", body: "Blake-stitched for longevity and resoling." },
      { title: "Calf Lining", body: "Soft, breathable, and broken in from day one." },
    ],
    release: "2026-06-01",
    sku: "AK-AX01-005",
  },
  {
    id: "vn-006",
    slug: "axis-low-midnight",
    model: "Axis Low",
    colorway: "Midnight",
    category: "Court",
    colorFamily: "Blue",
    price: 240,
    badge: "Restock",
    accent: "#2F5BFF",
    tagline: "After hours.",
    description:
      "Axis Low in deep midnight suede and leather, with a single cobalt flash at the heel. The everyday court shoe for the night shift.",
    image: img("axis-midnight"),
    views: stdViews("axis-midnight"),
    sizes: SIZES,
    soldOut: [11.5],
    specs: [
      { label: "Weight", value: "405 g / US 9" },
      { label: "Upper", value: "Suede + leather" },
      { label: "Sole", value: "Stitched rubber cupsole" },
      { label: "Lining", value: "Calf leather" },
      { label: "Made in", value: "Portugal" },
    ],
    features: [
      { title: "Midnight Suede", body: "Water-repellent treated suede with a deep nap." },
      { title: "Cobalt Heel", body: "A single hit of colour where it counts." },
      { title: "Stitched Cupsole", body: "Built to be resoled, not replaced." },
    ],
    release: "2026-05-15",
    sku: "AK-AX01-006",
  },
  {
    id: "vn-007",
    slug: "halo-mid-ash",
    model: "Halo Mid",
    colorway: "Ash",
    category: "Lifestyle",
    colorFamily: "Grey",
    price: 265,
    accent: "#A3A3A3",
    tagline: "Soft power.",
    description:
      "Brushed ash suede layered with lighter nubuck on a chunky sculpted midsole. Halo Mid is the off-duty uniform — padded, considered, and endlessly wearable.",
    image: img("halo-ash"),
    views: stdViews("halo-ash"),
    sizes: SIZES,
    soldOut: [6.5],
    specs: [
      { label: "Weight", value: "455 g / US 9" },
      { label: "Upper", value: "Brushed suede + nubuck" },
      { label: "Midsole", value: "Sculpted EVA" },
      { label: "Collar", value: "Padded mid-cut" },
      { label: "Laces", value: "Waxed tonal cotton" },
    ],
    features: [
      { title: "Brushed Suede", body: "Hand-brushed for a soft, cloud-like texture." },
      { title: "Sculpted Heel", body: "A moulded counter that cradles the heel." },
      { title: "Mid Cut", body: "Ankle-height padding for support and shape." },
    ],
    release: "2026-07-10",
    sku: "AK-HM01-007",
  },
  {
    id: "vn-008",
    slug: "strata-trail-moss",
    model: "Strata Trail",
    colorway: "Moss",
    category: "Trail",
    colorFamily: "Green",
    price: 295,
    badge: "New",
    accent: "#7A8B4E",
    tagline: "Off the grid. On the edge.",
    description:
      "Moss ripstop sealed with welded overlays, quick-pull bungee lacing and a deep 5mm lug outsole. Strata is engineered for terrain — and styled for the city it leaves behind.",
    image: img("strata-moss"),
    views: stdViews("strata-moss"),
    sizes: SIZES,
    soldOut: [12, 13],
    specs: [
      { label: "Weight", value: "312 g / US 9" },
      { label: "Drop", value: "6 mm" },
      { label: "Upper", value: "Ripstop + welded TPU" },
      { label: "Outsole", value: "5 mm multi-directional lugs" },
      { label: "Lacing", value: "Quick-pull bungee" },
    ],
    features: [
      { title: "Lug Outsole", body: "5mm multi-directional lugs for grip on loose ground." },
      { title: "Ripstop Shell", body: "Abrasion-resistant and water-repellent." },
      { title: "Bungee Lace", body: "One-pull lockdown, no knots." },
    ],
    release: "2026-10-01",
    sku: "AK-ST01-008",
  },
];
