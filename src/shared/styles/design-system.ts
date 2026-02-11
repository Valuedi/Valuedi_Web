/**
 * 디자인 시스템 타입 정의
 */

export type ColorToken =
  | 'neutral-0'
  | 'neutral-10'
  | 'neutral-20'
  | 'neutral-30'
  | 'neutral-40'
  | 'neutral-50'
  | 'neutral-60'
  | 'neutral-70'
  | 'neutral-80'
  | 'neutral-90'
  | 'neutral-100'
  | 'white'
  | 'black'
  | 'bg'
  | 'pri-normal'
  | 'pri-strong'
  | 'pri-heavy'
  | 'pri-light'
  | 'text-title'
  | 'text-body'
  | 'text-sub-body'
  | 'text-disabled'
  | 'status-error'
  | 'status-abled'
  | 'line-900'
  | 'bank-plus'
  | 'bank-kb'
  | 'bank-citi'
  | 'bank-kbank'
  | 'bank-saemaul'
  | 'bank-ibk'
  | 'bank-gwangju_jeonbuk'
  | 'bank-nh'
  | 'bank-suhyup'
  | 'bank-hana'
  | 'bank-nh'
  | 'bank-suhyup'
  | 'bank-hana'
  | 'bank-kdb'
  | 'bank-suhyup'
  | 'bank-nh'
  | 'bank-woori'
  | 'bank-sc'
  | 'bank-busan'
  | 'bank-shinhyup'
  | 'bank-postbank'
  | 'bank-hana'
  | 'bank-shinhan';

export type FontFamily = 'pretendard' | 'preahvihear';

export type FontSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type FontWeight = 'bold' | 'medium' | 'regular';

export type LineHeight =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35;

export type LetterSpacing = 0 | 1;

/**
 * 타이포그래피 스타일 타입
 */
export type TypographyStyle =
  | 'text-title-36-bold'
  | 'text-title-36-medium'
  | 'text-title-36-regular'
  | 'text-title-2-28-semi-bold'
  | 'text-title-2-28-medium'
  | 'text-title-2-28-regular'
  | 'text-title-3-24-bold'
  | 'text-title-3-24-medium'
  | 'text-title-3-24-regular'
  | 'text-headline-1-22-bold'
  | 'text-headline-1-22-medium'
  | 'text-headline-1-22-regular'
  | 'text-headline-2-20-semi-bold'
  | 'text-headline-2-20-medium'
  | 'text-headline-2-20-regular'
  | 'text-headline-3-18-semi-bold'
  | 'text-headline-3-18-medium'
  | 'text-headline-3-18-regular'
  | 'text-body-1-16-semi-bold'
  | 'text-body-1-16-medium'
  | 'text-body-1-16-regular'
  | 'text-body-1-16-reading-bold'
  | 'text-body-1-16-reading-medium'
  | 'text-body-1-16-reading-regular'
  | 'text-body-2-14-semi-bold'
  | 'text-body-2-14-medium'
  | 'text-body-2-14-regular'
  | 'text-body-3-13-bold'
  | 'text-body-3-13-medium'
  | 'text-body-3-13-regular'
  | 'text-caption-1-12-semi-bold'
  | 'text-caption-1-12-medium'
  | 'text-caption-1-12-regular'
  | 'text-caption-2-11-bold'
  | 'text-caption-2-11-medium'
  | 'text-caption-2-11-regular';

/**
 * 디자인 토큰 값 가져오기
 */
export const getColorToken = (token: ColorToken): string => {
  return `var(--color-${token.replace(/-/g, '-')})`;
};

/**
 * CSS 변수 이름 가져오기
 */
export const getCSSVariable = (name: string): string => {
  return `var(--${name})`;
};
