export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const EASE = [0.16, 1, 0.3, 1] as const;

export const FREE_SHIPPING_THRESHOLD = 250;
export const SHIPPING = 15;
