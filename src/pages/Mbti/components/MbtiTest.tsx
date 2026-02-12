import { Typography } from '@/shared/components';
import ProgressBar from '@/shared/components/bar/ProgressBar';
import { cn } from '@/shared/utils/cn';
import { useMbtiActions, useMbtiStore } from '@/shared/hooks/Mbti/useMbtiStore';
import { getMbtiQuestions } from '@/features/mbti/mbti.api';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const OPTIONS = [
  { label: '매우 그렇다.', value: 1 },
  { label: '그렇다.', value: 2 },
  { label: '보통이다.', value: 3 },
  { label: '아니다.', value: 4 },
  { label: '매우 아니다.', value: 5 },
];

export const MbtiTest = () => {
  const { testStep } = useMbtiStore();
  const { setAnswer, setTestStep, setStep } = useMbtiActions();

  const { data } = useQuery({
    queryKey: ['mbtiQuestions'],
    queryFn: getMbtiQuestions,
  });

  const questions = data?.result || [];
  const question = questions[testStep];

  const handleAnswer = (value: number) => {
    if (!question) return;

    setAnswer(question.id, value);

    if (testStep < questions.length - 1) {
      setTestStep(testStep + 1);
    } else {
      setStep('loading');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [testStep]);

  const progressPercentage = ((testStep + 1) / questions.length) * 100;

  return (
    <div className={cn('flex flex-col h-full min-h-screen bg-neutral-0')}>
      <div className="w-full">
        <ProgressBar percentage={progressPercentage} className="w-full h-[1px]" />
      </div>

      <div className="flex flex-col flex-1 px-[20px] mt-[19px]">
        <div className={cn('flex flex-col gap-[12px]')}>
          <Typography style="text-headline-3-18-semi-bold" className={cn('text-neutral-90 whitespace-pre-line')}>
            {question?.content}
          </Typography>
          <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
            사용자의 소비행태를 분석해요
          </Typography>
        </div>

        <div className="flex flex-col mt-[46px] gap-[8px]">
          {OPTIONS.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value)}
              className={cn(
                'w-full p-[12px] flex items-center gap-[8px] border border-neutral-10 rounded-[8px] active:bg-neutral-10 active:border-neutral-20'
              )}
            >
              <div
                className={cn('flex items-center justify-center w-[24px] h-[24px] rounded-[12px]', 'bg-primary-normal')}
              >
                <Typography style="text-caption-1-12-semi-bold" className="text-neutral-90">
                  {index + 1}
                </Typography>
              </div>

              <Typography style="text-body-2-14-regular" className="text-neutral-90">
                {option.label}
              </Typography>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
