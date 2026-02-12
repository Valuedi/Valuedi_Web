import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { CATEGORY_STYLES } from '@/features/asset/constants/category';
// 💡 유틸리티 파일에서 모든 핵심 타입을 임포트합니다.
import { TransactionWithDetails } from '../utils/sectorUtils';

/**
 * 💡 훅 -> 유틸리티를 거쳐 나오는 데이터 구조
 * 이제 items는 유틸에서 정의한 완성형 타입을 따릅니다.
 */
export interface SectorData {
  key: string; // 'food', 'transfer' 등 (카테고리 구분값)
  amount: number; // 해당 카테고리 총 지출 금액
  percentage: number; // 차트용 (합 100%)
  displayPct?: number; // 리스트 표시용 정수 퍼센트 (합 100)
  category: string; // 전체 대비 비중
  items?: TransactionWithDetails[]; // 상세 내역 리스트
}

interface SectorListItemProps {
  data: SectorData;
  label: string;
  onClick?: () => void;
}

export const SectorListItem = ({ data, label, onClick }: SectorListItemProps) => {
  // 데이터 구조에 맞춰 categoryKey 결정 (스타일 및 아이콘 매칭용)
  const categoryKey = data.key || 'default';
  const style = CATEGORY_STYLES[categoryKey] || CATEGORY_STYLES.default;

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between w-full h-14 py-2',
        'active:bg-neutral-5 transition-colors',
        // onClick 프롭이 전달되었을 때만 커서를 포인터로 변경
        onClick ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      {/* 왼쪽 영역: 카테고리 아이콘 + 텍스트 정보 */}
      <div className="flex items-center">
        <div className={cn('w-8 h-8 rounded-lg p-1 flex items-center justify-center flex-shrink-0', style.bgColor)}>
          <img src={style.icon} alt={label} className="w-[18px] h-[18px] object-contain" />
        </div>

        <div className="flex flex-col ml-2.5 text-left">
          <Typography variant="body-2" weight="bold" color="neutral-90">
            {label}
          </Typography>
          {/* 퍼센트가 0보다 클 때만 노출 (소수점 없이 정수형) */}
          {(() => {
            // displayPct가 있고 0보다 크면 사용, 아니면 percentage를 정수로 변환하여 사용
            const displayPct =
              data.displayPct !== undefined && data.displayPct > 0 ? data.displayPct : Math.floor(data.percentage);
            return displayPct > 0 ? (
              <Typography variant="caption-1" color="neutral-40">
                {displayPct}%
              </Typography>
            ) : null;
          })()}
        </div>
      </div>

      {/* 오른쪽 영역: 총 지출 금액 */}
      <div className="flex items-center">
        <Typography variant="body-2" weight="bold" color="neutral-90">
          {formatCurrency(data.amount)}
        </Typography>
      </div>
    </div>
  );
};
