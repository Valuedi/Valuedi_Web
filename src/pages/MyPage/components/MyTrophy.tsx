import { useMemo } from 'react';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { TROPHY_ICONS } from '@/features/mypage/constants/trophyIcons';
import DaySpendIcon from '@/assets/icons/trophy/day_spend.svg?react';
import { getTrophyIconByType } from '@/features/mypage/utils/trophyIconMapper';
import { useTrophies } from '@/features/trophy';
import { useQueries } from '@tanstack/react-query';
import { getMyTrophiesApi } from '@/features/trophy/trophy.api';

const MyTrophy = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDate = String(now.getDate()).padStart(2, '0');

  // 전체 트로피 목록 조회
  const { data: allTrophies = [], isLoading: isLoadingAll, isError: isErrorAll } = useTrophies();

  // 일간과 월간 트로피 데이터 조회
  const periodQueries = useQueries({
    queries: [
      {
        queryKey: ['myTrophies', 'DAILY', `${currentYear}-${currentMonth}-${currentDate}`],
        queryFn: async () => {
          const response = await getMyTrophiesApi({
            periodType: 'DAILY',
            periodKey: `${currentYear}-${currentMonth}-${currentDate}`,
          });
          return response.isSuccess && response.result ? response.result : [];
        },
      },
      {
        queryKey: ['myTrophies', 'MONTHLY', `${currentYear}-${currentMonth}`],
        queryFn: async () => {
          const response = await getMyTrophiesApi({
            periodType: 'MONTHLY',
            periodKey: `${currentYear}-${currentMonth}`,
          });
          return response.isSuccess && response.result ? response.result : [];
        },
      },
    ],
  });

  const dailyTrophies = periodQueries[0].data || [];
  const monthlyTrophies = periodQueries[1].data || [];
  const isLoadingMy = periodQueries.some((query) => query.isLoading);
  const isErrorMy = periodQueries.some((query) => query.isError);

  // 전체 트로피 목록에 획득 여부 정보 추가 (일간 + 월간)
  const allTrophiesWithStatus = useMemo(() => {
    if (!Array.isArray(allTrophies) || !Array.isArray(dailyTrophies) || !Array.isArray(monthlyTrophies)) return [];

    const dailyTrophyMap = new Map(dailyTrophies.map((t) => [t.trophyId, t]));
    const monthlyTrophyMap = new Map(monthlyTrophies.map((t) => [t.trophyId, t]));

    return allTrophies.map((trophy) => {
      const dailyTrophy = dailyTrophyMap.get(trophy.trophyId);
      const monthlyTrophy = monthlyTrophyMap.get(trophy.trophyId);

      const dailyCount = dailyTrophy?.achievedCount || 0;
      const monthlyCount = monthlyTrophy?.achievedCount || 0;
      const isEarned = dailyCount > 0 || monthlyCount > 0;

      return {
        ...trophy,
        dailyCount,
        monthlyCount,
        metricValue: monthlyTrophy?.metricValue || dailyTrophy?.metricValue || null,
        isEarned,
      };
    });
  }, [allTrophies, dailyTrophies, monthlyTrophies]);

  const isLoading = isLoadingAll || isLoadingMy;

  return (
    <div className={cn('flex flex-col gap-[24px]')}>
      {/* 전체 트로피 목록 */}
      <div className={cn('flex flex-col gap-[20px]')}>
        <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
          트로피
        </Typography>

        {isLoading ? (
          <Typography style="text-body-2-14-regular" className={cn('text-neutral-50')}>
            로딩 중...
          </Typography>
        ) : isErrorAll || isErrorMy ? (
          <Typography style="text-body-2-14-regular" className={cn('text-neutral-50')}>
            트로피를 불러오는 중 오류가 발생했습니다.
          </Typography>
        ) : allTrophies.length === 0 ? (
          <Typography style="text-body-2-14-regular" className={cn('text-neutral-50')}>
            트로피가 없습니다.
          </Typography>
        ) : (
          <div className={cn('flex flex-col gap-[8px]')}>
            {allTrophiesWithStatus.map((trophy) => {
              const iconKey = getTrophyIconByType(trophy.type);
              const IconComponent = TROPHY_ICONS[iconKey];
              const isEarned = trophy.isEarned;

              return (
                <div
                  key={trophy.trophyId}
                  className={cn(
                    'flex flex-col px-[12px] py-[16px] rounded-[8px] shadow-trophy-card gap-[20px]',
                    !isEarned && 'opacity-50' // 획득하지 않은 트로피는 흐리게 표시
                  )}
                >
                  <div className={cn('flex items-center gap-[8px]')}>
                    <div className={cn('w-[32px] h-[32px]', !isEarned && 'opacity-60')}>
                      <IconComponent />
                    </div>

                    <Typography
                      style="text-body-1-16-semi-bold"
                      className={cn(isEarned ? 'text-neutral-90' : 'text-neutral-50')}
                    >
                      {trophy.name}
                    </Typography>

                    {/* 일간 획득 횟수 */}
                    {trophy.dailyCount > 0 && (
                      <div className={cn('flex px-[8px] py-[4px] bg-yellow-400 rounded-full')}>
                        <Typography style="text-caption-2-11-medium" className={cn('text-neutral-90')}>
                          오늘 {trophy.dailyCount}번 달성
                        </Typography>
                      </div>
                    )}

                    {/* 월간 획득 횟수 */}
                    {trophy.monthlyCount > 0 && (
                      <div className={cn('flex px-[8px] py-[4px] bg-yellow-400 rounded-full')}>
                        <Typography style="text-caption-2-11-medium" className={cn('text-neutral-90')}>
                          이번달 {trophy.monthlyCount}번 달성
                        </Typography>
                      </div>
                    )}
                  </div>

                  <Typography
                    style="text-body-2-14-regular"
                    className={cn(isEarned ? 'text-neutral-70' : 'text-neutral-50')}
                  >
                    {trophy.description}
                  </Typography>

                  {isEarned && trophy.metricValue && (
                    <div className={cn('flex justify-between gap-[8px]')}>
                      <div className={cn('flex items-center')}>
                        <div className={cn('w-[24px] h-[24px] items-center justify-center flex')}>
                          <DaySpendIcon />
                        </div>
                        <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
                          소비 금액
                        </Typography>
                      </div>
                      <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                        {formatCurrency(Number(trophy.metricValue))}
                      </Typography>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrophy;
