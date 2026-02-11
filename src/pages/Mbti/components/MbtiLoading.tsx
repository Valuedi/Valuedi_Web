import { useEffect } from 'react';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';
import { useMbtiActions, useMbtiStore } from '@/shared/hooks/Mbti/useMbtiStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitMbtiTest } from '@/features/mbti/mbti.api';
import APGVIcon from '@/assets/icons/mbti/intro/APGV.svg?react';
export const MbtiLoading = () => {
  const { setStep } = useMbtiActions();
  const { answers } = useMbtiStore();
  const queryClient = useQueryClient();

  // 답변 제출 Mutation 정의
  const { mutate } = useMutation({
    mutationFn: submitMbtiTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mbtiResult'] });
      setTimeout(() => {
        setStep('result');
      }, 1500);
    },
    onError: (error) => {
      console.error('제출 실패:', error);
      alert('분석 결과 저장에 실패했습니다. 다시 시도해주세요.');
      setStep('test');
    },
  });

  useEffect(() => {
    // 서버 규격에 맞게 데이터 가공
    const formattedAnswers = Object.entries(answers).map(([id, value]) => ({
      questionId: Number(id),
      choiceValue: value,
    }));
    mutate(formattedAnswers);
  }, [mutate, answers]);

  return (
    <div className={cn('flex flex-col h-full min-h-screen bg-neutral-0')}>
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
        </div>

        <div className={cn('flex items-center justify-center mt-[113px] p-[12px]')}>
          <APGVIcon />
        </div>
      </div>
    </div>
  );
};
