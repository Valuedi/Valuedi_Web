import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import GoalIcon from '@/assets/icons/mypage/Goal.svg';

interface ConnectedGoalItemProps {
  title: string;
  subText: string;
  className?: string;
}

export const ConnectedGoalItem = ({ title, subText, className }: ConnectedGoalItemProps) => {
  return (
    <div className={cn('flex items-center gap-[8px] py-2', className)}>
      <div className="w-8 h-8 bg-atomic-red-60 rounded-lg flex items-center justify-center shrink-0">
        <img src={GoalIcon} alt="goal" />
      </div>

      <div className="flex flex-col min-w-0">
        <Typography variant="body-2" weight="semi-bold" className="text-neutral-90 truncate">
          {title}
        </Typography>
        <Typography variant="caption-1" className="text-neutral-70 truncate">
          {subText}
        </Typography>
      </div>
    </div>
  );
};
