import { useNavigate } from 'react-router-dom';
import { Typography } from '@/shared/components/typography';
import { SectorListItem, SectorData } from '../components/SectorListItem';
import { CATEGORY_LABELS } from '@/features/asset/constants/category';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';

/** 카테고리 key → 한글 라벨 (key 대소문자 무관, API 한글명 fallback) */
function getCategoryLabel(item: SectorData): string {
  const k = item.key;
  return (
    CATEGORY_LABELS[k ?? ''] ??
    CATEGORY_LABELS[(k ?? '').toLowerCase()] ??
    (typeof item.category === 'string' ? item.category : '') ??
    CATEGORY_LABELS.default
  );
}

interface SectorListSectionProps {
  data: SectorData[];
  isLoading?: boolean;
  selectedDate: Date;
}

export const SectorListSection = ({ data, isLoading = false, selectedDate }: SectorListSectionProps) => {
  const navigate = useNavigate();

  const topSectors = data.slice(0, 5);
  const otherSectors = data.slice(5);

  const otherCount = otherSectors.length;
  const otherTotalAmount = otherSectors.reduce((sum, item) => sum + item.amount, 0);
  const top5PctSum = topSectors.reduce((sum, item) => sum + (item.displayPct ?? Math.floor(item.percentage)), 0);
  const othersDisplayPct = Math.max(0, 100 - top5PctSum);

  return (
    <section className="px-5 bg-white pb-10">
      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-20 h-4 rounded" />
                  <Skeleton className="w-12 h-3 rounded" />
                </div>
              </div>
              <Skeleton className="w-24 h-5 rounded" />
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="py-10 text-center">
            <Typography variant="body-2" color="neutral-50">
              이 달에는 거래 내역이 없어요
            </Typography>
          </div>
        ) : (
          <>
            {topSectors.map((item) => (
              <SectorListItem
                key={item.key}
                data={item}
                label={getCategoryLabel(item)}
                onClick={() => {
                  navigate(`/asset/sector/${item.key}`, {
                    state: { sectorData: item, selectedDate: selectedDate.toISOString() },
                  });
                }}
              />
            ))}

            {/* 그외 N개 로직 (Top5 이외 카테고리 묶음) */}
            {otherCount > 0 && (
              <SectorListItem
                data={{
                  // 실제 API 기타 카테고리(others)와 구분하기 위해 별도 키 사용
                  key: 'others_group',
                  amount: otherTotalAmount,
                  percentage: 0,
                  displayPct: othersDisplayPct,
                  category: 'others_group',
                  items: [],
                }}
                label={`그외 ${otherCount}개`}
                onClick={() =>
                  navigate('/asset/sector-full', {
                    state: { filter: 'others', selectedDate: selectedDate.toISOString() },
                  })
                }
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};
