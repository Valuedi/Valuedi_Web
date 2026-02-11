import { useState } from 'react';
import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import CheckDownIcon from '@/assets/icons/CheckDown.svg?react';

export interface ProductInfoItem {
  label: string;
  value?: string;
  subText?: string;
}

interface ProductInfoListProps {
  items: ProductInfoItem[];
  className?: string;
  initialCount?: number;
}

export const ProductInfoList = ({ items, className, initialCount = 3 }: ProductInfoListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 펼쳐졌으면 전체, 아니면 initialCount만큼만 자름
  const visibleItems = isExpanded ? items : items.slice(0, initialCount);

  return (
    <div className={cn('flex flex-col gap-[8px]', className)}>
      <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
        상품 정보
      </Typography>
      {visibleItems.map((item, index) => (
        <div key={index} className={cn('flex flex-col gap-[8px] px-[12px] py-[16px] bg-neutral-10 rounded-[8px]')}>
          <Typography style="text-caption-1-12-semi-bold" className={cn('text-neutral-90')}>
            {item.label}
          </Typography>

          {item.value && (
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70 whitespace-pre-wrap')}>
              {item.value}
            </Typography>
          )}
          {item.subText && (
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70 whitespace-pre-wrap')}>
              {item.subText}
            </Typography>
          )}
        </div>
      ))}

      {items.length > initialCount && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center justify-center gap-[8px] border border-neutral-10 rounded-[4px] p-[8px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)] cursor-pointer w-full bg-white'
          )}
        >
          <Typography style="text-body-2-14-regular" className="text-neutral-70 text-center">
            {isExpanded ? '접기' : '목록 더 보기'}
          </Typography>
          <CheckDownIcon className={cn('text-neutral-70', isExpanded && 'rotate-180')} />
        </button>
      )}
    </div>
  );
};
