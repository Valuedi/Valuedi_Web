import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';
import KakaoIconUrl from '@/assets/icons/Kakao.svg';

export interface SocialLoginButtonsProps {
  className?: string;
  onKakaoClick?: () => void;
  onEmailClick?: () => void;
  text?: string;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  className,
  onKakaoClick,
  onEmailClick,
  text = '이메일로 계속하기',
}) => {
  const baseButtonClass = cn('flex items-center justify-center', 'w-full h-[48px]', 'rounded-[8px]');

  return (
    <div className={cn('flex flex-col gap-[16px] w-[343px]', className)}>
      <button type="button" className={cn(baseButtonClass, `bg-primary-normal`)} onClick={onKakaoClick}>
        <span className="flex items-center justify-center mr-[8px]">
          <img src={KakaoIconUrl} width="18" height="18" alt="icon" />
        </span>
        <Typography
          style="text-body-1-16-semi-bold"
          className={cn('text-center', 'text-neutral-90')}
          fontFamily="pretendard"
        >
          카카오 계정으로 계속하기
        </Typography>
      </button>

      <button
        type="button"
        className={cn(baseButtonClass, `bg-neutral-0 border border-neutral-20`)}
        onClick={onEmailClick}
      >
        <Typography
          style="text-body-1-16-semi-bold"
          className={cn('text-center', 'text-neutral-90')}
          fontFamily="pretendard"
        >
          {text}
        </Typography>
      </button>
    </div>
  );
};

export default SocialLoginButtons;
