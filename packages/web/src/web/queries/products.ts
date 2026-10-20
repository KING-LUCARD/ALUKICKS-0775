import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useProducts() {
  return useQuery(orpc.products.list.queryOptions({ staleTime: 5 * 60_000 }));
}

export function useProduct(slug: string) {
  return useQuery(orpc.products.get.queryOptions({ input: { slug }, staleTime: 5 * 60_000 }));
}
