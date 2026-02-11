import { apiGet, apiPost, apiPut, apiPatch, apiDelete, ApiError } from '@/shared/api';
import { createQueryKeys } from '@/shared/api/queryKeys';
import type {
  GetGoalsParams,
  GoalsResponse,
  CreateGoalRequest,
  CreateGoalResponse,
  GoalDetailResponse,
  LinkAccountRequest,
  LinkAccountResponse,
  UpdateGoalRequest,
  UpdateGoalResponse,
  DeleteGoalResponse,
  GoalLedgersResponse,
  GetGoalLedgersParams,
  GoalUnlinkedAccountsResponse,
} from './goal.types';

const GOALS_PATH_PREFIX = '/api/goals';

// ========== Query Key Factory ==========

export const goalKeys = createQueryKeys('goals', {
  lists: () => ['list'] as const,
  list: (params?: GetGoalsParams) => ['list', params] as const,
  details: () => ['detail'] as const,
  detail: (id: number) => ['detail', id] as const,
  ledgers: (goalId: number, params?: GetGoalLedgersParams) => ['ledgers', goalId, params] as const,
  unlinkedAccounts: () => ['unlinked-accounts'] as const,
});

export const goalApi = {
  async getGoals(params?: GetGoalsParams): Promise<GoalsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }

    const endpoint = `${GOALS_PATH_PREFIX}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiGet<GoalsResponse['result']>(endpoint) as Promise<GoalsResponse>;
  },

  // 목표 추가

  async createGoal(data: CreateGoalRequest): Promise<CreateGoalResponse> {
    console.log('목표 생성 API 요청:', {
      endpoint: GOALS_PATH_PREFIX,
      method: 'POST',
      data,
    });

    try {
      const result = await apiPost<CreateGoalResponse['result']>(GOALS_PATH_PREFIX, data);
      console.log('목표 생성 성공:', result);
      return result as CreateGoalResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('서버 에러 응답:', {
          code: error.code,
          message: error.message,
          status: error.status,
        });
      }
      throw error;
    }
  },

  // 목표 상세 조회

  async getGoalDetail(goalId: number): Promise<GoalDetailResponse> {
    try {
      const data = await apiGet<GoalDetailResponse['result']>(`${GOALS_PATH_PREFIX}/${goalId}`);
      const result = data?.result;
      if (result && typeof result === 'object') {
        // 서버에서 start_date, end_date로 올 수 있으므로 변환
        const resultWithSnakeCase = result as GoalDetailResponse['result'] & {
          start_date?: string;
          end_date?: string;
        };
        if (resultWithSnakeCase.start_date != null && result.startDate == null) {
          result.startDate = resultWithSnakeCase.start_date;
        }
        if (resultWithSnakeCase.end_date != null && result.endDate == null) {
          result.endDate = resultWithSnakeCase.end_date;
        }
      }
      return data as GoalDetailResponse;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error('목표를 찾을 수 없습니다.');
      }
      throw error;
    }
  },

  // 목표에 연결되지 않은 계좌 목록 조회

  async getGoalUnlinkedAccounts(): Promise<GoalUnlinkedAccountsResponse> {
    return apiGet<GoalUnlinkedAccountsResponse['result']>(
      `${GOALS_PATH_PREFIX}/accounts`
    ) as Promise<GoalUnlinkedAccountsResponse>;
  },

  // 목표-계좌 연결

  async linkAccount(goalId: number, data: LinkAccountRequest): Promise<LinkAccountResponse> {
    console.log('목표-계좌 연결 API 요청:', {
      endpoint: `${GOALS_PATH_PREFIX}/${goalId}/linked-accounts`,
      method: 'PUT',
      goalId,
      data,
    });

    try {
      const result = await apiPut<LinkAccountResponse['result']>(
        `${GOALS_PATH_PREFIX}/${goalId}/linked-accounts`,
        data
      );
      console.log('계좌 연결 성공:', result);
      return result as LinkAccountResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('서버 에러 응답:', {
          code: error.code,
          message: error.message,
          status: error.status,
        });
      }
      throw error;
    }
  },

  // 목표 수정
  async updateGoal(goalId: number, data: UpdateGoalRequest): Promise<UpdateGoalResponse> {
    try {
      const result = await apiPatch<UpdateGoalResponse['result']>(`${GOALS_PATH_PREFIX}/${goalId}`, data);
      return result as UpdateGoalResponse;
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        console.error('목표 수정 400 에러 응답:', {
          code: error.code,
          message: error.message,
          status: error.status,
        });
      }
      throw error;
    }
  },

  // 목표 삭제

  async deleteGoal(goalId: number): Promise<DeleteGoalResponse> {
    return apiDelete<DeleteGoalResponse['result']>(`${GOALS_PATH_PREFIX}/${goalId}`) as Promise<DeleteGoalResponse>;
  },

  // 목표 거래내역 조회

  async getGoalLedgers(goalId: number, params?: GetGoalLedgersParams): Promise<GoalLedgersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const endpoint = `${GOALS_PATH_PREFIX}/${goalId}/ledgers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiGet<GoalLedgersResponse['result']>(endpoint) as Promise<GoalLedgersResponse>;
  },
};

/** 목표 상세 조회 (HomePage 등에서 직접 호출용) */
export const getGoalDetailApi = (goalId: number) => goalApi.getGoalDetail(goalId);
