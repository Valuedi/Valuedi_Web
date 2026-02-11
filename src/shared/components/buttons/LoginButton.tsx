import React from 'react';
import { cn } from '@/shared/utils/cn';
import { BaseButton, BaseButtonProps } from './BaseButton';

export interface LoginButtonProps extends Omit<BaseButtonProps, 'size' | 'variant' | 'fullWidth'> {
  /**
   * 버튼 텍스트
   * @default '로그인'
   */
  text?: string;
}

/**
 * LoginButton 컴포넌트
 *
 * 로그인 페이지에서 사용하는 고정 너비의 Primary 버튼입니다.
 * BaseButton을 확장하여 특정 스타일(Primary Color, Fixed Width)만 적용합니다.
 *
 * @example
 * ```tsx
 * <LoginButton text="로그인" onClick={handleLogin} />
 * <LoginButton text="로그인" disabled loading />
 * ```
 */
const LoginButton: React.FC<LoginButtonProps> = ({ text = '로그인', className, ...props }) => {
  return <BaseButton size="medium" variant="primary" text={text} className={cn('w-[320px]', className)} {...props} />;
};

LoginButton.displayName = 'LoginButton';

export default LoginButton;
