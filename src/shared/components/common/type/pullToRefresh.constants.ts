export const PULL_TO_REFRESH_CONSTANTS = {
  /** 마찰 계수 (당기기 속도 조절) */
  FRICTION_COEFFICIENT: 0.5,
  /** 최대 당기기 거리 배수 */
  MAX_PULL_MULTIPLIER: 1.5,
  /** 변환 나누기 값 (이동 거리 절반) */
  TRANSFORM_DIVISOR: 2,
  /** 그라데이션 투명도 배수 */
  GRADIENT_OPACITY_MULTIPLIER: 0.6,
  /** 그라데이션 색상 (노란색 RGB) */
  GRADIENT_COLOR_RGB: { r: 255, g: 229, b: 0 },
  /** Toast 표시 시간 (밀리초) */
  TOAST_DURATION_MS: 2000,
  /** 새로고침 완료 애니메이션 시간 (밀리초) */
  REFRESH_ANIMATION_DURATION_MS: 300,
  /** 분을 밀리초로 변환하는 상수 */
  MINUTES_TO_MS: 60 * 1000,
  /** 트랜지션 시간 (밀리초) */
  TRANSITION_DURATION_MS: 300,
} as const;

/** Toast 메시지 */
export const TOAST_MESSAGE = '방금 업데이트된 내용입니다';
