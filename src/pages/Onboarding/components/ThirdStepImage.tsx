import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';

import nhIcon from '@/assets/icons/bank/nh.svg?react';
import ibkIcon from '@/assets/icons/bank/ibk.svg?react';

export const ThirdStepImage = () => {
  const [index, setIndex] = useState(0);

  const cardData = [
    {
      title: 'NH청년도약계좌',
      subTitle: '농협과 함께하는 자산 형성',
      bgColor: 'var(--color-bank-nh)',
      icon: nhIcon,
      bankName: 'NH농협은행',
    },
    {
      title: 'IBK내일적금',
      subTitle: '기업은행의 든든한 미래 설계',
      bgColor: 'var(--color-bank-ibk)',
      icon: ibkIcon,
      bankName: 'IBK기업은행',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const direction = index === 1 ? -1 : 1;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -250 : 250,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 250 : -250,
      opacity: 0,
    }),
  };

  const current = cardData[index];

  return (
    <div className={cn('relative w-full flex items-center justify-center overflow-hidden')}>
      {/* 메인 카드 영역 */}
      <div
        className={cn(
          'relative flex flex-col',
          'w-[270px] h-[240px] px-[20px] gap-[20px]',
          'bg-white/65 rounded-[8px] shadow-trophy-card overflow-hidden'
        )}
      >
        <div className={cn('flex flex-col gap-[4px]')}>
          <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
            적금 상품 추천
          </Typography>
          <Typography style="text-body-3-13-regular" className={cn('text-neutral-70')}>
            ???형에게는 이런 적금을 추천드려요
          </Typography>
        </div>

        {/* 중앙 배너 슬라이드 영역 */}
        <div className="relative flex-1 flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute"
            >
              <div
                style={{ backgroundColor: current.bgColor }}
                className={cn(
                  'w-[221px] h-[140px] rounded-[12px] px-[12px] py-[16px]',
                  'flex flex-col justify-between '
                )}
              >
                <div className="flex flex-col gap-[4px]">
                  <Typography style="text-body-1-16-semi-bold" className="text-neutral-90">
                    {current.title}
                  </Typography>
                  <Typography style="text-body-3-13-regular" className="text-neutral-70">
                    {current.subTitle}
                  </Typography>
                </div>

                <div className="self-end">
                  <current.icon width={24} height={24} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
