import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';

// 아이콘 임포트
import FoodIcon from '@/assets/icons/onboarding/Food.svg?react';
import SpendIcon from '@/assets/icons/onboarding/Spend.svg?react';
import TrafficIcon from '@/assets/icons/onboarding/Traffic.svg?react';
import ShoppingIcon from '@/assets/icons/onboarding/Shopping.svg?react';

export const SecondStepImage = () => {
  const [index, setIndex] = useState(0);

  const stepData = [
    {
      averageAmount: 124400,
      userAmount: 136000,
      bannerText: '금융에서 16,200원 더 쓰고 있어요',
      bannerBg: 'var(--color-atomic-yellow-90)',
      emoji: SpendIcon,
    },
    {
      averageAmount: 114320,
      userAmount: 142000,
      bannerText: '식비에서 32,800원 더 쓰고 있어요',
      bannerBg: 'var(--color-atomic-light-blue-90)',
      emoji: FoodIcon,
    },
  ];

  const icons = [TrafficIcon, ShoppingIcon, FoodIcon, SpendIcon, TrafficIcon, FoodIcon, SpendIcon, TrafficIcon];
  const moveDistance = 56;
  const current = stepData[index];

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev === 0 ? 1 : 0)), 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn('relative w-full flex items-center justify-center overflow-hidden')}>
      {/* 1. 배경 아이콘 */}
      <div className={cn('absolute inset-0 flex pointer-events-none items-end justify-center')}>
        <motion.div
          className={cn('flex gap-[16px]')}
          animate={{ x: index === 0 ? 0 : -moveDistance }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {icons.map((Icon, i) => (
            <div key={i} className={cn('min-w-[40px] h-[40px] flex items-center justify-center')}>
              <Icon />
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. 메인 카드 영역 */}
      <div
        className={cn(
          'relative flex flex-col',
          'w-[280px] h-[292px] px-[20px] gap-[20px]',
          'bg-white/65 rounded-[8px] shadow-trophy-card overflow-hidden'
        )}
      >
        {/* 상단 텍스트 */}
        <div className={cn('flex flex-col gap-[4px]')}>
          <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
            또래별 비교
          </Typography>
          <Typography style="text-body-3-13-regular" className={cn('text-neutral-70')}>
            또래 평균보다 월별 <span className={cn('text-neutral-90')}>19만원 이상</span> 더 지출해요
          </Typography>
        </div>

        {/* 중앙 그래프 영역: 고정 높이 부여로 배너 위치 고정 */}
        <div className={cn('flex items-end justify-center gap-[40px]')}>
          <Bar label="또래 평균" amount={current.averageAmount} />
          <Bar label="???님" amount={current.userAmount} isHighlight={true} />
        </div>

        {/* 하단 배너 */}
        <motion.div
          animate={{ backgroundColor: current.bannerBg }}
          transition={{ duration: 0.4 }}
          className={cn('flex items-center gap-[8px]', 'h-[40px] px-[12px]', 'rounded-[8px] w-full mt-auto')}
        >
          <current.emoji />
          <Typography style="text-caption-1-12-semi-bold" className={cn('text-neutral-90')}>
            {current.bannerText}
          </Typography>
        </motion.div>
      </div>
    </div>
  );
};

const Bar = ({ label, amount, isHighlight }: { label: string; amount: number; isHighlight?: boolean }) => {
  const barHeight = amount * 0.00050735;

  return (
    <div className={cn('flex flex-col items-center gap-[8px] w-[60px]')}>
      <Typography
        style="text-caption-1-12-semi-bold"
        className={cn(isHighlight ? 'text-neutral-90' : 'text-neutral-50')}
      >
        {formatCurrency(amount)}
      </Typography>

      <motion.div
        initial={false}
        animate={{ height: `${barHeight}px` }}
        className={cn('w-[48px] rounded-[4px]', isHighlight ? 'bg-atomic-yellow-50' : 'bg-neutral-20')}
      />
      <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
        {label}
      </Typography>
    </div>
  );
};
