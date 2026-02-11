import { useQuery } from '@tanstack/react-query';
import { accountApi, accountKeys } from './account.api';

/**
 * 연결된 계좌 목록 조회
 */
export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: () => accountApi.getAccounts(),
  });
}
