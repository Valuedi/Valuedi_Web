import { useEffect, useMemo, useState } from 'react';
import { Typography } from '@/shared/components';
import ProgressBar from '@/shared/components/bar/ProgressBar';
import { cn } from '@/shared/utils/cn';
import { useMbtiStore } from '@/shared/hooks/Mbti/useMbtiStore';
import APGVIcon from '@/assets/icons/mbti/intro/APGV.svg?react';
import { useSubmitMbtiAnswers } from '@/pages/Mbti/hooks/useSubmitMbtiAnswers';
export const MbtiLoading = () => {
  const { answers } = useMbtiStore();
  const [progress, setProgress] = useState(18);
  const [dotCount, setDotCount] = useState(0);

  useSubmitMbtiAnswers(answers);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 92));
    }, 160);

    const dotTimer = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 450);

    return () => {
      clearInterval(progressTimer);
      clearInterval(dotTimer);
    };
  }, []);

  const animatedDots = useMemo(() => '.'.repeat(dotCount), [dotCount]);

  return (
    <div className={cn('flex flex-col h-full min-h-screen bg-neutral-0')}>
      <div className="w-full">
        <ProgressBar percentage={progress} className="w-full h-[1px]" aria-label="MBTI 분석 진행률" />
      </div>

      <div className={cn('flex flex-col flex-1 px-[20px]')}>
        <div className={cn('flex flex-col gap-[12px] mt-[20px]')}>
          <Typography style="text-headline-3-18-semi-bold" className={cn('text-neutral-90')}>
            회원님의 금융 MBTI를
            <br />
            분석중이에요
          </Typography>
          <Typography style="text-body-2-14-regular" className={cn('text-neutral-70 whitespace-pre-line')}>
            검사결과지를 바탕으로 MBTI를 분석 중이에요
            <br />
            잠시만 기다려 주세요.
          </Typography>
          <Typography
            style="text-body-2-14-regular"
            className={cn('text-primary-normal min-h-[20px]')}
            aria-live="polite"
          >
            분석 중{animatedDots}
          </Typography>
        </div>

        <div className={cn('flex items-center justify-center mt-[113px] p-[12px]')}>
          <APGVIcon />
        </div>
      </div>
    </div>
  );
};
