import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';

import kbIcon from '@/assets/icons/bank/kb.svg?react';
import nhIcon from '@/assets/icons/bank/nh.svg?react';
import ibkIcon from '@/assets/icons/bank/ibk.svg?react';
import shinhanIcon from '@/assets/icons/bank/jeju_shinhan.svg?react';
import hanaIcon from '@/assets/icons/bank/hana.svg?react';
import wooriIcon from '@/assets/icons/bank/woori.svg?react';
import kbankIcon from '@/assets/icons/bank/kbank.svg?react';
import saemaulIcon from '@/assets/icons/bank/saemaul.svg?react';
import scIcon from '@/assets/icons/bank/sc.svg?react';
import postIcon from '@/assets/icons/bank/postbank.svg?react';

export const FourthStepImage = () => {
  const bankData = useMemo(
    () => [
      { name: '국민은행', icon: kbIcon },
      { name: '농협은행', icon: nhIcon },
      { name: '기업은행', icon: ibkIcon },
      { name: '신한은행', icon: shinhanIcon },
      { name: '하나은행', icon: hanaIcon },
      { name: '우리은행', icon: wooriIcon },
      { name: '케이뱅크', icon: kbankIcon },
      { name: '새마을', icon: saemaulIcon },
      { name: 'SC은행', icon: scIcon },
      { name: '우체국', icon: postIcon },
    ],
    []
  );

  const displayData = [...bankData, ...bankData, ...bankData];
  const unitWidth = 75;

  const centerOffset = 360 / 2 - 71 / 2;
  const initialX = -(bankData.length * unitWidth) + centerOffset;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 3) % bankData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [bankData.length]);

  return (
    <div className="relative w-full flex justify-center">
      <div className="overflow-hidden w-screen mx-[-20px] flex justify-center">
        <div className="w-[360px] flex items-center">
          <motion.div
            className="flex gap-[4px] items-center"
            initial={{ x: initialX }}
            animate={{ x: initialX - index * unitWidth }}
            transition={{
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {displayData.map((bank, i) => {
              const isHighlighted = i === bankData.length + index;

              return (
                <div
                  key={i}
                  className={cn(
                    'min-w-[71px] h-[76px] rounded-[8px] flex flex-col items-center justify-center gap-[12px]',
                    'bg-white border-[1px]',
                    isHighlighted ? 'border-primary-normal bg-neutral-10' : 'border-neutral-10'
                  )}
                >
                  <bank.icon width={22} height={22} />
                  <Typography style="text-caption-1-12-medium" className="text-neutral-90">
                    {bank.name}
                  </Typography>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
