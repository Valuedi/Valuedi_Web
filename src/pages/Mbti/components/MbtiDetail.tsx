import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';
import { useGetMbtiTestResult } from '@/shared/hooks/Mbti/useGetMbtiTestResult';
import { MbtiCard } from '@/shared/components/mbti';
import { MbtiDetailChart } from './MbtiDetailChart';
import { calculateMbtiScores } from '@/shared/utils/calculateMbtiScore';
import { formatMbtiDescription } from '@/shared/utils/formatMbtiText';
import { MBTI_LOCAL_EXTENSIONS } from '@/features/mbti/constants/mbtiType';
import { useState } from 'react';
import { MoreViewButton } from '@/shared/components/buttons';

export const MbtiDetail = () => {
  const { data: result, isLoading } = useGetMbtiTestResult();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return <div className="p-20 text-center">결과 분석 중...</div>;
  if (!result || !result.title) return <div className="p-20 text-center">데이터를 찾을 수 없습니다.</div>;

  const traits = calculateMbtiScores(result);

  const localResult = MBTI_LOCAL_EXTENSIONS[result.resultType];

  return (
    <div className={cn('flex flex-col min-h-screen bg-neutral-0 px-[20px] gap-[48px] pb-[60px]')}>
      <div className={cn('flex flex-col items-center')}>
        <MbtiCard
          mbtiType={result.title}
          subDetail={result.tagline}
          description={result.extraDescription}
          icon={result.icon}
          className="mt-[20px]"
        />
      </div>

      <div className={cn('flex flex-col gap-[12px]')}>
        <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90">
          세부사항
        </Typography>
        <div className={cn('w-full rounded-[12px] p-[12px] bg-neutral-10 flex flex-col gap-[8px]')}>
          <Typography
            style="text-body-2-14-regular"
            className={cn('text-neutral-70 whitespace-pre-wrap', !isOpen && 'line-clamp-3')}
          >
            {formatMbtiDescription(result.detail)}
          </Typography>

          <div onClick={() => setIsOpen(!isOpen)} className={cn('flex gap-[4px] items-center w-fit cursor-pointer')}>
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
              {isOpen ? '간략히보기' : '자세히보기'}
            </Typography>
            <MoreViewButton className={cn(isOpen ? '-rotate-90' : 'rotate-90')} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[4px]">
          <Typography style="text-caption-1-12-regular" className="text-neutral-50">
            회원님의 MBTI 세부사항은?
          </Typography>
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90">
            {localResult?.subTitle ? localResult.subTitle : result.title}
          </Typography>
        </div>
        <div className="flex flex-col gap-[24px]">
          {traits.map((trait) => (
            <MbtiDetailChart
              key={trait.title}
              title={trait.title}
              leftLabel={trait.leftLabel}
              rightLabel={trait.rightLabel}
              leftScore={trait.leftScore}
              description={trait.description}
              details={trait.details}
            />
          ))}
        </div>
      </div>

      <div className={cn('flex flex-col gap-[12px]')}>
        <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90">
          주의할 점
        </Typography>
        <div className={cn('flex flex-col p-[12px] rounded-[12px] bg-neutral-10')}>
          {result.cautions?.map((text, i) => (
            <Typography key={i} style="text-body-2-14-regular" className="text-neutral-70 whitespace-pre-wrap">
              {formatMbtiDescription(text)}
            </Typography>
          ))}
        </div>
      </div>

      <div className={cn('flex flex-col gap-[12px]')}>
        <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90">
          추천하는 행동 및 습관
        </Typography>
        <div className={cn('flex flex-col p-[12px] rounded-[12px] bg-neutral-10')}>
          {result.recommendedActions?.map((text, i) => (
            <Typography key={i} style="text-body-2-14-regular" className="text-neutral-70 whitespace-pre-wrap">
              {formatMbtiDescription(text)}
            </Typography>
          ))}
        </div>
      </div>

      <div className={cn('flex gap-[8px] bg-neutral-10 px-[20px] py-[12px] -mx-[20px]')}>
        <Typography
          style="text-caption-2-11-regular"
          className="text-neutral-70 whitespace-pre-line text-center w-full"
        >
          {`본 금융 MBTI 결과는 참고용 분석 결과입니다.\n 설문 응답에 기반한 성향 추정이므로, 실제 개인의 금융 상황 및 투자 성과와는 차이가 있을 수 있습니다.\n 금융 의사결정 시에는 반드시 추가적인 정보 확인을 하시기 바랍니다.`}
        </Typography>
      </div>
    </div>
  );
};
