import { SectorData } from '../utils/sectorUtils';
import { CATEGORY_STYLES } from '@/features/asset/constants/category';
import { cn } from '@/shared/utils/cn';

interface SectorChartProps {
  data: SectorData[];
}

export const SectorChart = ({ data }: SectorChartProps) => {
  return (
    <div className="w-full">
      {' '}
      {/* 예전 코드처럼 px-5로 양옆 여백 확보 ㅋ */}
      <div className="flex h-5 w-full rounded overflow-hidden gap-0.5">
        {data.map((item: SectorData) => {
          // 💡 카테고리에 맞는 스타일 가져오기 (others는 bg-neutral-80)
          const style = CATEGORY_STYLES[item.key] || CATEGORY_STYLES.default;

          // 💡 금액이 0보다 큰 경우에만 렌더링
          if (item.amount <= 0) return null;

          return (
            <div
              key={item.key}
              className={cn(
                'h-full transition-all duration-500',
                style.barColor // 💡 예전 코드처럼 cn으로 스타일 바인딩 ㅋ
              )}
              // 💡 width는 유틸에서 이미 계산된 percentage 사용 (전체 지출 대비 비율)
              style={{ width: `${item.percentage}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};
