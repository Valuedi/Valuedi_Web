import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

export interface CardCardProps {
  cardName: string;
  cardIcon: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const CardCard: React.FC<CardCardProps> = ({ cardName, cardIcon, isSelected = false, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-[4px] items-center justify-center p-[12px] rounded-[8px] w-[71px]',
        isSelected ? 'bg-neutral-10 border border-primary-normal' : 'bg-white border border-neutral-10',
        className
      )}
    >
      <div className="w-[32px] h-[32px] flex items-center justify-center overflow-hidden px-[2px] py-[4px]">
        <img src={cardIcon} alt={cardName} className="w-full h-full object-contain" />
      </div>
      <Typography
        variant="caption-1"
        weight={isSelected ? 'medium' : 'regular'}
        className={cn('text-center whitespace-nowrap', isSelected ? 'text-neutral-90' : 'text-neutral-70')}
      >
        {cardName}
      </Typography>
    </button>
  );
};

export default CardCard;
