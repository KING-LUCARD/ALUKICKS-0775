import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "../lib/store";

const queryClient = new QueryClient();

interface ProviderProps {
  children: React.ReactNode;
}

// App-level providers — React Query (API) + ALU KICKS store (cart, wishlist).
export function Provider({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>{children}</StoreProvider>
    </QueryClientProvider>
  );
}
