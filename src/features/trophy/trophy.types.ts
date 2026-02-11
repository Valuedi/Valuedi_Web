/**
 * 트로피 관련 타입 정의
 */

/** 트로피 타입 */
export type TrophyType = 'COFFEE_ADDICT' | string;

/** 전체 트로피 목록 항목 */
export interface Trophy {
  trophyId: number;
  name: string;
  type: TrophyType;
  description: string;
}

/** 내 트로피 현황 항목 */
export interface MyTrophy {
  trophyId: number;
  name: string;
  type: TrophyType;
  achievedCount: number;
  metricValue: string;
}

/** 기간 타입 */
export type PeriodType = 'DAILY' | 'MONTHLY' | 'LAST_30_DAYS';

/** 내 트로피 조회 파라미터 */
export interface GetMyTrophiesParams {
  periodType?: PeriodType;
  periodKey: string; // 예: '2025-12', '2025-12-27'
}
