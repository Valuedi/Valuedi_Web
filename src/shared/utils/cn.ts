import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 커스텀 Tailwind 클래스를 유지하기 위한 tailwind-merge 설정
 */
const customTwMerge = twMerge;

/**
 * 클래스명을 병합하는 유틸리티 함수
 * clsx와 tailwind-merge를 결합하여 Tailwind 클래스 충돌을 자동으로 해결합니다.
 * 커스텀 Typography 클래스(text-body-1, font-semi-bold 등)는 유지됩니다.
 *
 * @example
 * ```tsx
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500'
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('text-body-1', 'font-semi-bold') // 'text-body-1 font-semi-bold'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
