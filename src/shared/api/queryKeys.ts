/**
 * Query Key Factory 유틸리티
 *
 * TanStack Query의 queryKey를 타입 안전하게 관리하기 위한 팩토리 패턴을 제공합니다.
 *
 * @example
 * ```typescript
 * export const goalKeys = createQueryKeys('goals', {
 *   lists: () => ['list'],
 *   list: (params?: GetGoalsParams) => ['list', params],
 *   details: () => ['detail'],
 *   detail: (id: number) => ['detail', id],
 * });
 *
 * // 사용
 * queryKey: goalKeys.list(params)
 * queryKey: goalKeys.detail(goalId)
 * ```
 */

/**
 * Query Key Factory를 생성하는 헬퍼 함수
 *
 * @param baseKey - 기본 키 (예: 'goals', 'accounts')
 * @param factories - 각 쿼리 키를 생성하는 팩토리 함수들
 * @returns 타입 안전한 Query Key Factory 객체
 */
export function createQueryKeys<
  TBaseKey extends string,
  TFactories extends Record<string, (...args: never[]) => readonly unknown[]>,
>(baseKey: TBaseKey, factories: TFactories) {
  const base = [baseKey] as const;

  type KeysType = {
    [K in keyof TFactories]: TFactories[K] extends (...args: infer P) => infer R
      ? R extends readonly unknown[]
        ? (...args: P) => readonly [...typeof base, ...R]
        : never
      : never;
  };

  const keys = {} as KeysType & { all?: readonly [TBaseKey] };

  for (const [key, factory] of Object.entries(factories)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (keys as Record<string, (...args: never[]) => readonly unknown[]>)[key] = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: never[]
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (factory as (...args: never[]) => readonly unknown[])(...args);
      return [...base, ...result] as const;
    };
  }

  // all 키 추가
  keys.all = base;

  return keys as KeysType & { all: readonly [TBaseKey] };
}

/**
 * Query Key Factory 타입
 *
 * @example
 * ```typescript
 * type GoalKeys = QueryKeyFactory<'goals', {
 *   lists: () => ['list'];
 *   detail: (id: number) => ['detail', id];
 * }>;
 * ```
 */
export type QueryKeyFactory<
  TBaseKey extends string,
  TFactories extends Record<string, (...args: never[]) => readonly unknown[]>,
> = {
  all: readonly [TBaseKey];
} & {
  [K in keyof TFactories]: TFactories[K] extends (...args: infer P) => infer R
    ? R extends readonly unknown[]
      ? (...args: P) => readonly [TBaseKey, ...R]
      : never
    : never;
};
