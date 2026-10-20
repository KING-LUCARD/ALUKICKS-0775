import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useCreateOrder() {
  return useMutation(orpc.orders.create.mutationOptions());
}
