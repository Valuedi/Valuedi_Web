import { useState, useMemo, useEffect } from 'react';
import { useGetRecommendDetail } from './useGetRecommendDetail';
import { calculateInterest } from '@/shared/utils/calculateInterest';

export const useInterestCalculator = (initialAmount = 400000, initialDuration = 12) => {
  const { productInfo } = useGetRecommendDetail();
  const { basicRate, maxRate } = productInfo;

  const [monthlyAmount, setMonthlyAmount] = useState(initialAmount);
  const [duration, setDuration] = useState(initialDuration);
  const [currentRate, setCurrentRate] = useState(basicRate);

  useEffect(() => {
    if (basicRate) {
      setCurrentRate(basicRate);
    }
  }, [basicRate]);

  const estimatedInterest = useMemo(() => {
    return calculateInterest(monthlyAmount, duration, currentRate);
  }, [monthlyAmount, duration, currentRate]);

  return {
    monthlyAmount,
    setMonthlyAmount,
    duration,
    setDuration,
    currentRate,
    setCurrentRate,
    estimatedInterest,
    basicRate,
    maxRate,
  };
};
