import { useRef } from 'react';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';
import { useNavigate } from 'react-router-dom';
import { BaseButton } from '@/shared/components/buttons/BaseButton';

interface OnboardingStepProps {
  step: number;
  title: string;
  description: string;
  visual?: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
}

export const OnboardingStep = ({ step, title, description, visual, onNext, onPrev }: OnboardingStepProps) => {
  const navigate = useNavigate();
  const totalSteps = 4;
  const isLastStep = step === totalSteps;

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleLogin = () => {
    if (isLastStep) {
      navigate('/login');
    }
  };

  const handleContentClick = () => {
    if (!isLastStep && onNext) {
      onNext();
    }
  };

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    if (startX == null || startY == null) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // 가로 스와이프만 인식 (세로 스크롤과 구분)
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0 && !isLastStep && onNext) {
      // 왼쪽으로 스와이프 → 다음 스텝
      onNext();
    } else if (deltaX > 0 && step > 1 && onPrev) {
      // 오른쪽으로 스와이프 → 이전 스텝
      onPrev();
    }
  };

  return (
    <div
      className={cn('bg-white relative min-h-screen w-full flex flex-col')}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 메인 컨텐츠 영역 */}
      <div
        className={cn(
          'flex-1 flex flex-col items-center px-4 sm:px-5 gap-6 sm:gap-8 md:gap-12 min-h-0',
          !isLastStep && 'cursor-pointer'
        )}
        style={{
          paddingTop: 'clamp(80px, 19vh, 152px)',
          paddingBottom: 'clamp(60px, 13vh, 103px)',
        }}
        onClick={handleContentClick}
      >
        {/* 텍스트 영역 */}
        <div className={cn('flex flex-col gap-3 sm:gap-4 items-center w-full max-w-[320px] flex-shrink-0')}>
          <Typography
            style="text-headline-1-22-semi-bold"
            className={cn('text-center text-neutral-90 w-full')}
            as="div"
          >
            {title.split('\n').map((line, index) => (
              <p key={index} className={cn(index === 0 ? 'mb-0' : '')}>
                {line}
              </p>
            ))}
          </Typography>
          <Typography
            style="text-body-1-16-regular"
            color={isLastStep ? 'neutral-60' : 'neutral-70'}
            className={cn('text-center w-full')}
          >
            {description}
          </Typography>
        </div>

        {/* 이미지 영역 */}
        <div className="w-full flex justify-center items-center h-[300px]">{visual}</div>

        {/* 진행 표시기 */}
        <div className={cn('flex gap-2 sm:gap-[8px] items-center mt-auto mb-4')}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'rounded-full',
                index === step - 1 ? 'bg-primary-normal h-[8px] w-6 sm:w-[24px]' : 'bg-neutral-40 size-2 sm:size-[8px]'
              )}
            />
          ))}
        </div>

        {/* 로그인 버튼 */}
        <div
          className={cn('w-full max-w-[320px] flex-shrink-0 -mt-6 sm:-mt-8 md:-mt-12')}
          onClick={(e) => e.stopPropagation()}
        >
          <BaseButton
            size="medium"
            variant="primary"
            text="로그인하기"
            onClick={handleLogin}
            disabled={!isLastStep}
            className={cn(
              'w-full whitespace-nowrap',
              isLastStep ? 'bg-primary-normal [&>p]:text-neutral-90' : 'bg-primary-light [&>p]:text-neutral-50'
            )}
            typographyStyle="text-body-1-16-semi-bold"
          />
        </div>
      </div>
    </div>
  );
};
