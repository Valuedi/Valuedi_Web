import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';

// 아이콘 임포트
import WIcon from '@/assets/icons/onboarding/W.svg?react';
import CalendarIcon from '@/assets/icons/onboarding/Calendar.svg?react';
import FoodIcon from '@/assets/icons/onboarding/Food.svg?react';
import ShoppingIcon from '@/assets/icons/onboarding/Shopping.svg?react';
import SpendIcon from '@/assets/icons/onboarding/Spend.svg?react';
import TrafficIcon from '@/assets/icons/onboarding/Traffic.svg?react';

export const FirstStepImage = () => {
  const [index, setIndex] = useState(0);

  const cardData = [
    {
      amount: '923,387원',
      percent: '43% 달성',
      banner: '식비에서 ???원 적게 쓰면?',
      bannerBg: 'var(--color-atomic-light-blue-90)',
      emoji: FoodIcon,
    },
    {
      amount: '526,387원',
      percent: '32% 달성',
      banner: '금융에서 ???원 아끼면?',
      bannerBg: 'var(--color-atomic-yellow-90)',
      emoji: SpendIcon,
    },
  ];

  const icons = [TrafficIcon, ShoppingIcon, FoodIcon, SpendIcon, TrafficIcon, FoodIcon, SpendIcon, TrafficIcon];

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev === 0 ? 1 : 0)), 2000);
    return () => clearInterval(timer);
  }, []);

  const current = cardData[index];
  const moveDistance = 56;

  return (
    <div className={cn('relative w-full flex items-center justify-center overflow-hidden')}>
      {/* 1. 배경 아이콘  */}
      <div className={cn('absolute inset-0 flex items-center justify-center pointer-events-none')}>
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
          'relative z-10 flex flex-col justify-between',
          'w-[228px] h-[264px] px-[12px] py-[16px]',
          'bg-white/65 rounded-[8px]',
          'shadow-trophy-card'
        )}
      >
        {/* 상단: 총 모인 금액 */}
        <div className={cn('flex flex-col gap-[4px]')}>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
            총 모인 금액
          </Typography>
          <div className={cn('flex items-center gap-[6px] h-8')}>
            <Typography style="text-headline-2-20-semi-bold" className={cn('text-neutral-90')}>
              {current.amount}
            </Typography>
            <span className={cn('flex px-[6px] py-[2px] rounded-full bg-primary-normal border border-primary-light')}>
              <Typography style="text-caption-1-12-medium" className={cn('text-neutral-90')}>
                {current.percent}
              </Typography>
            </span>
          </div>
        </div>

        {/* 중앙 배너: 가림막 역할 */}
        <motion.div
          animate={{ backgroundColor: current.bannerBg }}
          className={cn('relative h-[40px] px-[12px] flex items-center gap-[8px] rounded-[8px]')}
        >
          <current.emoji />
          <Typography style="text-caption-1-12-semi-bold" className={cn('text-neutral-90')}>
            {current.banner}
          </Typography>
        </motion.div>

        {/* 하단 정보 */}
        <div className={cn('flex flex-col gap-[12px]')}>
          <div className={cn('flex justify-between items-center')}>
            <div className={cn('flex items-center gap-1.5')}>
              <WIcon width={12} height={12} />
              <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
                목표금액
              </Typography>
            </div>
            <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
              10,000,000원
            </Typography>
          </div>

          <div className={cn('flex justify-between items-center')}>
            <div className={cn('flex items-center gap-1.5')}>
              <CalendarIcon width={12} height={10} className={cn('text-primary-normal')} />
              <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
                남은일자
              </Typography>
            </div>
            <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
              91일
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
