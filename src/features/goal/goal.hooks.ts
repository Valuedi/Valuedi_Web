import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalApi, goalKeys } from './goal.api';
import type {
  GetGoalsParams,
  CreateGoalRequest,
  GoalSort,
  LinkAccountRequest,
  UpdateGoalRequest,
  GetGoalLedgersParams,
} from './goal.types';
// 목표 목록 조회
export function useGoals(params?: GetGoalsParams) {
  return useQuery({
    queryKey: goalKeys.list(params),
    queryFn: () => goalApi.getGoals(params),
  });
}
// 활성 목표 목록 조회
export function useActiveGoals(sort?: GoalSort) {
  return useGoals({ status: 'ACTIVE', sort });
}
// 완료된 목표 목록 조회
export function useCompletedGoals(sort?: GoalSort) {
  return useGoals({ status: 'COMPLETE', sort });
}
//실패한 목표 목록 조회
export function useFailedGoals(sort?: GoalSort) {
  return useGoals({ status: 'FAILED', sort });
}
// 목표 추가
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalApi.createGoal(data),
    onSuccess: () => {
      // 목표 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
    },
  });
}
// 목표 상세 조회
export function useGoalDetail(goalId?: number) {
  return useQuery({
    queryKey: goalKeys.detail(goalId!),
    queryFn: () => goalApi.getGoalDetail(goalId!),
    enabled: !!goalId,
  });
}
// 목표에 연결되지 않은 계좌 목록 조회
export function useGoalUnlinkedAccounts(enabled = true) {
  return useQuery({
    queryKey: goalKeys.unlinkedAccounts(),
    queryFn: () => goalApi.getGoalUnlinkedAccounts(),
    enabled,
  });
}
// 목표-계좌 연결
export function useLinkAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: number; data: LinkAccountRequest }) => goalApi.linkAccount(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.details() });
    },
  });
}
// 목표 수정
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: number; data: UpdateGoalRequest }) => goalApi.updateGoal(goalId, data),
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
    },
  });
}
// 목표 삭제
export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: number) => goalApi.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.details() });
    },
  });
}

//목표 거래내역 조회
export function useGoalLedgers(goalId: number | undefined, params?: GetGoalLedgersParams) {
  return useQuery({
    queryKey: goalKeys.ledgers(goalId ?? 0, params),
    queryFn: () => goalApi.getGoalLedgers(goalId!, params),
    enabled: !!goalId,
  });
}
