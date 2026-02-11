import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { getColorToken } from '@/shared/styles/design-system';
import { BANNER } from '@/features/recommend/constants/banner';

interface Props {
  bankName: string;
  productName: string;
  description: string;
  onClick?: () => void;
}

export const RecommendListItem = ({ bankName, productName, description, onClick }: Props) => {
  const targetBank = BANNER.find((item) => item.name === bankName);
  const backgroundColor = targetBank ? getColorToken(targetBank.color) : getColorToken('neutral-10');

  return (
    <div onClick={onClick} className={cn('flex items-center gap-[8px] py-[8px] w-full cursor-pointer')}>
      <div
        style={{ backgroundColor: backgroundColor }}
        className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center')}
      >
        {targetBank ? (
          <img src={targetBank.icon} alt={bankName} className="w-[20px] h-[20px]" />
        ) : (
          <div className="w-[32px] h-[32px] bg-neutral-30 rounded-[8px]" />
        )}
      </div>

      <div className={cn('flex flex-col gap-[2px]')}>
        <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
          {productName}
        </Typography>
        <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
          {description}
        </Typography>
      </div>
    </div>
  );
};
