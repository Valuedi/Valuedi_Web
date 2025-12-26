import { QueryClient } from '@tanstack/react-query';

// TanStack Query 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});
