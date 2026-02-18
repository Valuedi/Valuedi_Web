export type GoalStatus = 'ACTIVE' | 'COMPLETE' | 'FAILED';
// 정렬
export type GoalSort = 'TIME_DESC' | 'PROGRESS_DESC';
//기본 정보
export interface Goal {
  goalId: number;
  title: string;
  savedAmount: number;
  targetAmount?: number;
  currentBalance?: number;
  remainingDays: number;
  achievementRate: number;
  status: GoalStatus;
  colorCode: string;
  iconId: number;
} //목표 목록
export interface GoalsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    goals: Goal[];
  };
} // 목표 목록 조회
export interface GetGoalsParams {
  status?: GoalStatus;
  sort?: GoalSort;
  limit?: number;
}
// 목표 추가
export interface CreateGoalRequest {
  bankAccountId: number;
  title: string;
  startDate: string;
  endDate: string;
  targetAmount: number;
  colorCode: string;
  iconId: number;
}

// 목표 추가
export interface CreateGoalResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    goalId: number;
    title: string;
    targetAmount: number;
    startAmount: number;
    startDate: string;
    endDate: string;
    remainingDays: number;
    account: {
      bankName: string;
      accountNumber: string;
    };
    iconId: number;
  };
}

// 성세 정보
export interface GoalDetail {
  goalId: number;
  title: string;
  savedAmount: number;
  currentBalance?: number;
  targetAmount: number;
  remainingDays: number;
  achievementRate: number;
  startDate?: string;
  endDate?: string;
  account: {
    bankName: string;
    accountNumber: string;
    balanceAmount?: number;
    currentBalance?: number;
  };
  status: GoalStatus;
  colorCode: string;
  iconId: number;
}

// 목표 상세 조회
export interface GoalDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GoalDetail;
}

// 홈 화면: 진행 중 목표 목록 조회 (/api/goals/primary)
export interface PrimaryGoalsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    goals: Array<{
      goalId: number;
      title: string;
      targetAmount: number;
      iconId: number;
    }>;
  };
}

//  목표-계좌 연결
export interface LinkAccountRequest {
  accountId: number;
}

// 목표-계좌 연결
export interface LinkAccountResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

//  목표 수정
export interface UpdateGoalRequest {
  title?: string;
  startDate?: string;
  endDate?: string;
  targetAmount?: number;
  colorCode?: string;
  iconId?: number;
}

// 목표 수정
export interface UpdateGoalResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GoalDetail;
}

//목표 삭제
export interface DeleteGoalResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

// 거래내역 항목
export interface LedgerItem {
  id: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryCode: string;
  categoryName: string;
  transactionAt: string;
  memo: string;
}

//목표 거래내역 조회
export interface GoalLedgersResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    content: LedgerItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// 목표 거래내역 조회
export interface GetGoalLedgersParams {
  page?: number;
  size?: number;
}

// 목표에 연결되지 않은 계좌 목록 조회
export interface UnlinkedAccountItem {
  accountId: number;
  accountName: string;
  accountDisplay: string;
}

export interface GoalUnlinkedAccountsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accounts: UnlinkedAccountItem[];
  };
}
