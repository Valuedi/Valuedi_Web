import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';
import { LoginButton } from '@/shared/components/buttons';
import { useMbtiActions } from '@/shared/hooks/Mbti/useMbtiStore';
import { motion, Variants } from 'framer-motion';

import APGVIcon from '@/assets/icons/mbti/intro/APGV.svg?react';
import AIGRIcon from '@/assets/icons/mbti/intro/AIGR.svg?react';
import AIGVIcon from '@/assets/icons/mbti/intro/AIGV.svg?react';
import APCVIcon from '@/assets/icons/mbti/intro/APCV.svg?react';
import APGRIcon from '@/assets/icons/mbti/intro/APGR.svg?react';
import SIGVIcon from '@/assets/icons/mbti/intro/SIGV.svg?react';
import SPGVIcon from '@/assets/icons/mbti/intro/SPGV.svg?react';

export const MbtiIntro = () => {
  const { setStep } = useMbtiActions();

  const INTRO_ICONS = [APGVIcon, APGRIcon, SIGVIcon, APCVIcon, SPGVIcon, AIGVIcon, AIGRIcon];
  const DUP_ICONS = [...INTRO_ICONS, ...INTRO_ICONS];

  const animationVariants: Variants = {
    animate: {
      x: [0, '-50%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 20,
          ease: 'linear',
        },
      },
    },
  };

  const handleStart = () => {
    setStep('test');
  };

  return (
    <div className={cn('flex flex-col h-full min-h-screen bg-neutral-0')}>
      <div className={cn('flex flex-col flex-1 px-[20px] pb-[20px]')}>
        <div className={cn('flex flex-col gap-[12px] mt-[20px]')}>
          <Typography style="text-headline-3-18-semi-bold" className={cn('text-neutral-90')}>
            나의 금융 MBTI를
            <br />
            찾아볼까요?
          </Typography>
          <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
            사용자의 소비행태를 분석해요
          </Typography>
        </div>

        <div className={cn('flex mt-[130px] w-full overflow-hidden')}>
          <motion.div
            variants={animationVariants}
            animate="animate"
            className={'flex'}
            style={{ willChange: 'transform' }}
          >
            {DUP_ICONS.map((Icon, index) => (
              <div key={index} className={cn('flex pr-[10px]')}>
                <div className={cn('flex p-[12px] rounded-[8px]')}>
                  <Icon />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className={cn('flex flex-col items-center justify-center mt-[243px]')}>
          <LoginButton text="검사 시작하기" onClick={handleStart} />
        </div>
      </div>
    </div>
  );
};
