import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { LoginButton } from '@/shared/components/buttons';

interface QuickButton {
  label: string;
  value: number;
}

interface NumberInputBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  title: string;
  initialValue: number;
  unit: string;
  max: number;
  quickButtons?: QuickButton[];
}

export const NumberInputBottomSheet = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  initialValue,
  unit,
  max,
  quickButtons = [],
}: NumberInputBottomSheetProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (isVisible) {
      setInputValue(initialValue.toString());
    }
  }, [isVisible, initialValue]);

  // 키패드를 눌렀을 때 입력값 처리
  const handleNumberClick = (num: string) => {
    setInputValue((prev) => {
      if (prev === '0') return num;
      const nextValue = prev + num;
      if (Number(nextValue) > max) return max.toString();
      return nextValue;
    });
  };

  // 마지막 글자를 지우도록 처리
  const handleBackspace = () => {
    setInputValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  // 빠른 추가 버튼 -> 현재 값에 금액을 더하도록 처리
  const handleQuickAdd = (amount: number) => {
    setInputValue((prev) => {
      const current = Number(prev) || 0;
      const next = current + amount;
      return next > max ? max.toString() : next.toString();
    });
  };

  // 입력하기 처리
  const handleConfirm = () => {
    onConfirm(Number(inputValue));
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={cn('fixed inset-0 z-50 flex items-end justify-center w-[360px] mx-auto')}>
      <div className={cn('absolute inset-0 bg-neutral-90 opacity-50')} onClick={onClose} />

      <div className={cn('flex flex-col relative bg-white rounded-t-[12px] px-[20px] gap-[20px]')}>
        <div className={cn('flex justify-center gap-[10px] py-[10px]')}>
          <div className={cn('w-[80px] h-[2px] bg-neutral-50 rounded-full cursor-pointer')} onClick={onClose} />
        </div>

        <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
          {title}
        </Typography>

        <div className={cn('flex justify-end items-center bg-neutral-10 rounded-[8px] px-[12px] py-[8px]')}>
          <div className={cn('flex items-center gap-[2px]')}>
            <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
              {inputValue === '' ? '0' : Number(inputValue).toLocaleString()}
            </Typography>
            <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
              {unit}
            </Typography>
          </div>
        </div>

        {quickButtons.length > 0 && (
          <div className={cn('flex gap-[8px]')}>
            {quickButtons.map((btn, index) => (
              <button
                key={index}
                onClick={() => handleQuickAdd(btn.value)}
                className={cn(
                  'flex items-center justify-center whitespace-nowrap gap-[2px] px-[12px] w-[74px] py-[6px] rounded-full border border-neutral-30'
                )}
              >
                <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                  {btn.label}
                </Typography>
              </button>
            ))}
          </div>
        )}

        <div className={cn('grid grid-cols-3 -mx-[20px]')}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className={cn('flex items-center justify-center h-[48px] w-full px-[10px] py-[12px]')}
            >
              <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
                {num}
              </Typography>
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick('0')}
            className={cn('flex items-center justify-center h-[48px] w-full px-[10px] py-[12px]')}
          >
            <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
              0
            </Typography>
          </button>
          <button onClick={handleBackspace} className={cn('flex items-center justify-center h-[48px] w-full')}>
            <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
              ←
            </Typography>
          </button>
        </div>

        <div className={cn('pb-[20px]')}>
          <LoginButton text="입력하기" onClick={handleConfirm} />
        </div>
      </div>
    </div>
  );
};
