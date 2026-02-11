import { create } from 'zustand';

type StepType = 'intro' | 'test' | 'loading' | 'result' | 'detail';

interface MbtiState {
  step: StepType;
  testStep: number;
  answers: Record<number, number>;
  actions: {
    setStep: (step: StepType) => void;
    setTestStep: (step: number) => void;
    setAnswer: (questionId: number, score: number) => void;
    reset: () => void;
  };
}

export const useMbtiStore = create<MbtiState>((set) => ({
  step: 'intro',
  testStep: 0,
  answers: {},

  actions: {
    setStep: (step) => set({ step }),
    setTestStep: (step) => set({ testStep: step }),
    setAnswer: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
    reset: () => set({ step: 'intro', testStep: 0, answers: {} }),
  },
}));

export const useMbtiActions = () => useMbtiStore((state) => state.actions);
