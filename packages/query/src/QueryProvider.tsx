import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/** 합리적 기본값을 가진 QueryClient 생성기. */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/** 앱 루트를 감쌉니다. 내부에서 클라이언트를 1회 생성해 유지합니다. */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
