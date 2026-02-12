import { useState, useCallback } from 'react';
import type { GoalStep } from './goalForm.types';

export interface UseGoalStepOptions {
  initialStep?: GoalStep;
}

export function useGoalStep(options: UseGoalStepOptions = {}) {
  const [currentStep, setCurrentStep] = useState<GoalStep>(options.initialStep ?? 1);

  const goToNext = useCallback((step?: GoalStep) => {
    setCurrentStep((prev) => (step ?? prev + 1) as GoalStep);
  }, []);

  const goToBack = useCallback((step?: GoalStep) => {
    setCurrentStep((prev) => (step ?? prev - 1) as GoalStep);
  }, []);

  const goToStep = useCallback((step: GoalStep) => {
    setCurrentStep(step);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    goToNext,
    goToBack,
    goToStep,
  };
}
