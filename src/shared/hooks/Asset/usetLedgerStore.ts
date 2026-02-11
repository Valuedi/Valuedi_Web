import { create } from 'zustand';
import { ViewMode } from '@/shared/components/buttons';

interface LedgerState {
  currentMonth: number;
  viewMode: ViewMode;
  actions: {
    setViewMode: (mode: ViewMode) => void;
    prevMonth: () => void;
    nextMonth: () => void;
  };
}

export const useLedgerStore = create<LedgerState>((set) => ({
  currentMonth: new Date().getMonth() + 1,
  viewMode: 'list',
  actions: {
    setViewMode: (mode) => set({ viewMode: mode }),

    prevMonth: () =>
      set((state) => ({
        currentMonth: state.currentMonth === 1 ? 12 : state.currentMonth - 1,
      })),

    nextMonth: () =>
      set((state) => ({
        currentMonth: state.currentMonth === 12 ? 1 : state.currentMonth + 1,
      })),
  },
}));

// 액션만 따로 꺼내쓰기 위해서 헬퍼 함수를 작성했습니다
export const useLedgerActions = () => useLedgerStore((state) => state.actions);
