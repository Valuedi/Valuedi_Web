import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

export interface ConnectedCardItemProps {
  cardName: string;
  cardIcon: string;
  className?: string;
}

const ConnectedCardItem: React.FC<ConnectedCardItemProps> = ({ cardName, cardIcon, className }) => {
  return (
    <div className={cn('flex items-center justify-center gap-[8px] px-0 py-[8px]', className)}>
      <div className="w-[36px] h-[36px] flex items-center justify-center bg-neutral-10 rounded-[4px]">
        <div className="w-[32px] h-[32px] flex items-center justify-center overflow-hidden px-[2px] py-[4px]">
          <img src={cardIcon} alt={cardName} className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="flex-1 flex items-center min-w-0">
        <Typography variant="body-2" weight="regular" className="text-neutral-90">
          {cardName}
        </Typography>
      </div>
    </div>
  );
};

export default ConnectedCardItem;
