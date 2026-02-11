import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { getColorToken } from '@/shared/styles/design-system';
import { BANNER } from '@/features/recommend/constants/banner';

interface RecommendBannerCardProps {
  title: string;
  subTitle: string;
  bankId: string;
  onClick?: () => void;
}

export const RecommendBannerCard = ({ title, subTitle, bankId, onClick }: RecommendBannerCardProps) => {
  const targetBank = BANNER.find((bank) => bank.id === bankId);
  const backgroundColor = targetBank ? getColorToken(targetBank.color) : getColorToken('neutral-10');

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: `rgb(from ${backgroundColor} r g b / 1)` }}
      className={cn(
        'w-[221px] h-[140px] md:w-full md:h-[180px] lg:h-[200px]',
        'rounded-[12px] md:rounded-[16px]',
        'px-[12px] py-[16px] md:px-[20px] md:py-[24px] lg:px-[24px] lg:py-[28px]',
        'flex flex-col gap-[2px] md:gap-[8px] justify-between shrink-0',
        'transition-all duration-300 ease-in-out',
        'cursor-pointer',
        'md:hover:scale-[1.02] md:hover:shadow-lg',
        onClick && 'hover:opacity-90'
      )}
    >
      <div className="flex flex-col gap-[2px] md:gap-[4px]">
        <Typography
          style="text-body-1-16-semi-bold"
          className="text-neutral-90 md:text-headline-3-18-semi-bold lg:text-headline-2-20-semi-bold"
          fontFamily="pretendard"
        >
          {title}
        </Typography>
        <Typography
          style="text-body-3-13-regular"
          className="text-neutral-70 md:text-body-2-14-regular lg:text-body-1-16-regular"
          fontFamily="pretendard"
        >
          {subTitle}
        </Typography>
      </div>

      <div className="self-end">
        <div className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] lg:w-[48px] lg:h-[48px] flex items-center justify-center">
          {targetBank && <img src={targetBank.icon} alt={targetBank.name} className="w-full h-full object-contain" />}
        </div>
      </div>
    </div>
  );
};
