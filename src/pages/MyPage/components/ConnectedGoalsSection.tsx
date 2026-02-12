import { Typography } from '@/shared/components/typography';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';
import { ConnectedGoalItem } from '@/shared/components/mypage/ConnectedGoalItem';

interface ConnectedGoalsSectionProps {
  goals?: Array<{ id: string; title: string; subText: string }>;
  isLoading?: boolean;
}

export const ConnectedGoalsSection = ({ goals = [], isLoading = false }: ConnectedGoalsSectionProps) => {
  return (
    <div className="w-full">
      <Typography variant="body-1" weight="semi-bold" className="mb-4 block text-neutral-90">
        연결된 목표
      </Typography>

      <div className="space-y-1">
        {isLoading ? (
          Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-1/2 h-5 rounded" />
                <Skeleton className="w-1/3 h-4 rounded" />
              </div>
            </div>
          ))
        ) : goals.length > 0 ? (
          goals.map((goal) => <ConnectedGoalItem key={goal.id} title={goal.title} subText={goal.subText} />)
        ) : (
          <div className="py-6 text-center bg-neutral-5 rounded-xl">
            <Typography variant="body-2" className="text-neutral-40">
              연결된 목표가 없습니다.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
