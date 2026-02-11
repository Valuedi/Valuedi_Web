import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';
import type { TypographyStyle, ColorToken } from '@/shared/styles/design-system';

export type ButtonSize = 'small' | 'medium' | 'large' | 'custom';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export interface BaseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * 버튼 크기
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * 버튼 변체 (색상 스타일)
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * 로딩 상태
   * @default false
   */
  loading?: boolean;
  /**
   * 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;
  /**
   * 버튼 텍스트 (children 대신 사용 가능)
   */
  text?: string;
  /**
   * 자식 요소 (아이콘 등 포함 가능)
   */
  children?: React.ReactNode;
  /**
   * Typography style (Figma 디자인 토큰)
   * @default 'text-body-1-16-semi-bold'
   */
  typographyStyle?: TypographyStyle;
}

/**
 * BaseButton 컴포넌트
 *
 * 모든 버튼 컴포넌트의 기반이 되는 공통 버튼 컴포넌트입니다.
 * 크기, 변체, 로딩 상태 등을 통합 관리합니다.
 *
 * @example
 * ```tsx
 * <BaseButton size="large" variant="primary" text="클릭하세요" />
 * <BaseButton size="medium" variant="outline" loading>
 *   <Icon /> 로딩 중...
 * </BaseButton>
 * ```
 */
export const BaseButton: React.FC<BaseButtonProps> = ({
  size = 'medium',
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  text,
  children,
  typographyStyle = 'text-body-1-16-semi-bold',
  className,
  ...props
}) => {
  const isDisabled = disabled || loading;

  // 크기별 스타일 매핑
  const sizeStyles: Record<ButtonSize, string> = {
    small: 'h-[34px] px-[12px] py-[8px] rounded-[4px]',
    medium: 'h-[48px] px-[24px] py-[10px] rounded-[8px]',
    large: 'h-[56px] px-[32px] py-[12px] rounded-[8px]',
    custom: '', // custom은 className으로 크기 지정
  };

  // 변체별 스타일 매핑
  const variantStyles: Record<ButtonVariant, { default: string; disabled: string; active?: string }> = {
    primary: {
      default: 'bg-primary-normal active:bg-atomic-yellow-40',
      disabled: 'bg-primary-light cursor-not-allowed',
    },
    secondary: {
      default: 'bg-neutral-0 border border-neutral-90',
      disabled: 'bg-neutral-20 cursor-not-allowed border border-neutral-40',
    },
    outline: {
      default: 'bg-neutral-0 border border-neutral-90',
      disabled: 'bg-neutral-20 cursor-not-allowed border border-neutral-40',
    },
    ghost: {
      default: 'bg-transparent',
      disabled: 'bg-transparent cursor-not-allowed opacity-50',
    },
  };

  const textColorTokens: Record<ButtonVariant, { default: string; disabled: string }> = {
    primary: {
      default: 'neutral-90',
      disabled: 'neutral-60',
    },
    secondary: {
      default: 'neutral-90',
      disabled: 'neutral-60',
    },
    outline: {
      default: 'neutral-90',
      disabled: 'neutral-60',
    },
    ghost: {
      default: 'neutral-90',
      disabled: 'neutral-60',
    },
  };

  const sizeClass = sizeStyles[size];
  const variantClass = isDisabled ? variantStyles[variant].disabled : variantStyles[variant].default;
  const activeClass = !isDisabled && variantStyles[variant].active ? variantStyles[variant].active : '';
  const textColorToken = isDisabled ? textColorTokens[variant].disabled : textColorTokens[variant].default;

  // children이 있으면 children을 렌더링, 없으면 text를 Typography로 렌더링
  const buttonContent = children || (
    <Typography
      style={typographyStyle}
      className="text-center"
      fontFamily="pretendard"
      color={textColorToken as ColorToken}
    >
      {text}
    </Typography>
  );

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        'flex items-center justify-center',
        sizeClass,
        variantClass,
        activeClass,
        fullWidth && 'w-full',
        loading && 'cursor-wait',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          {buttonContent}
        </span>
      ) : (
        buttonContent
      )}
    </button>
  );
};

BaseButton.displayName = 'BaseButton';

export default BaseButton;
