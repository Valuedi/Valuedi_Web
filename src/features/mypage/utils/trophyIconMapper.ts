/**
 * 트로피 ID 또는 타입에 따라 아이콘 키를 반환하는 유틸리티
 */

import type { TrophyIconKey } from '../constants/trophyIcons';

/**
 * 트로피 ID에 따라 아이콘 키를 반환
 * @param trophyId 트로피 ID
 * @returns 아이콘 키
 */
export function getTrophyIconByTrophyId(trophyId: number): TrophyIconKey {
  // 트로피 ID에 따른 아이콘 매핑
  const trophyIdToIconMap: Record<number, TrophyIconKey> = {
    1: 'coffee', // 커피중독자
    2: 'night', // 야식의 왕
    3: 'no_spend', // 무지출데이
    4: 'max_spend', // 최다 지출
    5: 'min_spend', // 최소 지출
    // 필요에 따라 추가 트로피 ID 매핑
  };

  return trophyIdToIconMap[trophyId] || 'coffee';
}

/**
 * 트로피 타입에 따라 아이콘 키를 반환
 * @param trophyType 트로피 타입 (예: 'COFFEE_ADDICT')
 * @returns 아이콘 키
 */
export function getTrophyIconByType(trophyType: string): TrophyIconKey {
  // 트로피 타입에 따른 아이콘 매핑
  const trophyTypeToIconMap: Record<string, TrophyIconKey> = {
    COFFEE_ADDICT: 'coffee',
    LATE_NIGHT_SNACK: 'night',
    NO_SPEND_DAY: 'no_spend',
    MAX_SPEND: 'max_spend',
    MIN_SPEND: 'min_spend',
  };

  return trophyTypeToIconMap[trophyType] || 'coffee';
}

/**
 * 트로피 ID 또는 타입으로 아이콘 키를 반환 (우선순위: ID > 타입)
 * @param trophyId 트로피 ID
 * @param trophyType 트로피 타입 (선택적)
 * @returns 아이콘 키
 */
export function getTrophyIcon(trophyId?: number, trophyType?: string): TrophyIconKey {
  if (trophyId !== undefined) {
    return getTrophyIconByTrophyId(trophyId);
  }
  if (trophyType) {
    return getTrophyIconByType(trophyType);
  }
  return 'coffee'; // 기본값
}
