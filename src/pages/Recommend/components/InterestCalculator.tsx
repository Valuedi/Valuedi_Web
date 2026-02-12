import { useState, useMemo, useEffect } from 'react';
import { CategoryButton } from '@/shared/components/buttons';
import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { CustomSlider } from './CustomSlider';
import { NumberInputBottomSheet } from './NumberInputSheet';
import { calculateInterest } from '@/shared/utils/calculateInterest';

const AMOUNT_LIMITS = {
  MIN: 50000,
  MINLABEL: '5만원',
  MAX: 3000000,
  MAXLABEL: '300만원',
  STEP: 10000,
};

const DURATION_LIMITS = {
  MIN: 3,
  MINLABEL: '3개월',
  MAX: 24,
  MAXLABEL: '24개월',
  STEP: 1,
};

interface InterestCalculatorProps {
  basicRate?: number;
  maxRate?: number;
}

export const InterestCalculator = ({ basicRate = 0, maxRate = 0 }: InterestCalculatorProps) => {
  const [monthlyAmount, setMonthlyAmount] = useState(400000);
  const [duration, setDuration] = useState(12);
  const [currentRate, setCurrentRate] = useState(basicRate);

  useEffect(() => {
    if (basicRate > 0) {
      setCurrentRate(basicRate);
    }
  }, [basicRate]);

  const estimatedInterest = useMemo(() => {
    return calculateInterest(monthlyAmount, duration, currentRate);
  }, [monthlyAmount, duration, currentRate]);

  const [isAmountSheetOpen, setIsAmountSheetOpen] = useState(false);
  const [isDurationSheetOpen, setIsDurationSheetOpen] = useState(false);

  const buttonStyle = 'h-auto px-[8px] py-[4px]';

  return (
    <div className={cn('flex flex-col gap-[20px]')}>
      <div className={cn('flex flex-col gap-[8px]')}>
        <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
          이자 계산기
        </Typography>

        <div className={cn('flex flex-col bg-neutral-10 rounded-[8px] px-[12px] py-[16px] gap-[8px]')}>
          <Typography style="text-headline-3-18-semi-bold" className={cn('text-neutral-90')}>
            이자 {formatCurrency(estimatedInterest)}
          </Typography>

          <div className={cn('flex gap-[4px]')}>
            <CategoryButton
              text={`기본 ${basicRate}%`}
              isSelected={currentRate === basicRate}
              onClick={() => setCurrentRate(basicRate)}
              className={cn(buttonStyle, currentRate !== basicRate && 'bg-neutral-20')}
            />

            <CategoryButton
              text={`우대 ${(maxRate - basicRate).toFixed(1)}%`}
              isSelected={currentRate === maxRate}
              onClick={() => setCurrentRate(maxRate)}
              className={cn(buttonStyle, currentRate !== maxRate && 'bg-neutral-20')}
            />
          </div>
        </div>
      </div>

      <div className={cn('flex flex-col gap-[8px]')}>
        <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
          한 달에{' '}
          <span
            onClick={() => setIsAmountSheetOpen(true)}
            className={cn('underline decoration-1 decoration-neutral-90 underline-offset-2 cursor-pointer')}
          >
            {monthlyAmount / 10000}만원
          </span>
        </Typography>

        <div className={cn('flex justify-between py-[8px]')}>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
            {AMOUNT_LIMITS.MINLABEL}
          </Typography>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
            {AMOUNT_LIMITS.MAXLABEL}
          </Typography>
        </div>

        <CustomSlider
          min={AMOUNT_LIMITS.MIN}
          max={AMOUNT_LIMITS.MAX}
          step={AMOUNT_LIMITS.STEP}
          value={monthlyAmount}
          onChange={setMonthlyAmount}
        />
      </div>

      <div className={cn('flex flex-col gap-[8px]')}>
        <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
          <span
            onClick={() => setIsDurationSheetOpen(true)}
            className={cn('underline decoration-1 decoration-neutral-90 underline-offset-2 cursor-pointer')}
          >
            {duration}개월
          </span>{' '}
          모으기
        </Typography>

        <div className={cn('flex justify-between py-[8px]')}>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
            {DURATION_LIMITS.MINLABEL}
          </Typography>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
            {DURATION_LIMITS.MAXLABEL}
          </Typography>
        </div>

        <CustomSlider
          min={DURATION_LIMITS.MIN}
          max={DURATION_LIMITS.MAX}
          step={DURATION_LIMITS.STEP}
          value={duration}
          onChange={setDuration}
        />
      </div>

      <NumberInputBottomSheet
        isVisible={isAmountSheetOpen}
        onClose={() => setIsAmountSheetOpen(false)}
        title="금액선택"
        unit="만원"
        initialValue={monthlyAmount / 10000}
        max={300}
        quickButtons={[
          { label: '+ 1만원', value: 1 },
          { label: '+ 5만원', value: 5 },
          { label: '+ 10만원', value: 10 },
          { label: '전액', value: AMOUNT_LIMITS.MAX },
        ]}
        onConfirm={(val) => {
          const realAmount = val * 10000;
          if (realAmount < AMOUNT_LIMITS.MIN) setMonthlyAmount(AMOUNT_LIMITS.MIN);
          else if (realAmount > AMOUNT_LIMITS.MAX) setMonthlyAmount(AMOUNT_LIMITS.MAX);
          else setMonthlyAmount(realAmount);
        }}
      />

      <NumberInputBottomSheet
        isVisible={isDurationSheetOpen}
        onClose={() => setIsDurationSheetOpen(false)}
        title="기간선택"
        unit="개월"
        initialValue={duration}
        max={24}
        quickButtons={[
          { label: '+ 1개월', value: 1 },
          { label: '+ 3개월', value: 3 },
          { label: '+ 6개월', value: 6 },
          { label: '+ 12개월', value: 12 },
        ]}
        onConfirm={(val) => {
          if (val < DURATION_LIMITS.MIN) setDuration(DURATION_LIMITS.MIN);
          else if (val > DURATION_LIMITS.MAX) setDuration(DURATION_LIMITS.MAX);
          else setDuration(val);
        }}
      />
    </div>
  );
};
