import { useEffect, useMemo, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mbtiKeys, submitMbtiTest } from '@/features/mbti/mbti.api';
import { formatMbtiAnswersForSubmit } from '@/features/mbti/mbti.mapper';
import { useMbtiActions } from '@/shared/hooks/Mbti/useMbtiStore';

export const useSubmitMbtiAnswers = (answers: Record<number, number>) => {
  const { setStep } = useMbtiActions();
  const queryClient = useQueryClient();
  const isMountedRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formattedAnswers = useMemo(() => formatMbtiAnswersForSubmit(answers), [answers]);

  const { mutate } = useMutation({
    mutationFn: submitMbtiTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mbtiKeys.result() });
      stepTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setStep('result');
      }, 1500);
    },
    onError: (error) => {
      console.error('제출 실패:', error);
      if (!isMountedRef.current) return;
      alert('분석 결과 저장에 실패했습니다. 다시 시도해주세요.');
      setStep('test');
    },
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasSubmittedRef.current) return;

    if (formattedAnswers.length === 0) {
      setStep('test');
      return;
    }

    hasSubmittedRef.current = true;
    mutate(formattedAnswers);
  }, [formattedAnswers, mutate, setStep]);
};
