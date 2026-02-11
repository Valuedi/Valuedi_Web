import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { AssetDailyHeader } from '../AssetDetails/components/AssetDailyHeader';
import { AssetItemList } from '../AssetDetails/components/AssetItemList';
import { CATEGORY_STYLES, CATEGORY_LABELS } from '@/features/asset/constants/category';
import { useGetAssetAnalysis } from '@/shared/hooks/Asset/useGetAssetAnalysis';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { TransactionWithDetails, SectorTransactionGroup, transformToDateGroups, SectorData } from './utils/sectorUtils';

export const SectorDetailPage = () => {
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
  const [selectedItem, setSelectedItem] = useState<TransactionWithDetails | null>(null);

  const stateData = location.state?.sectorData as SectorData | undefined;
  // state로 카테고리 데이터가 넘어온 경우에는 분석 API 호출을 생략해 리소스 사용을 줄인다.
  const { allSectors, isLoading } = useGetAssetAnalysis(selectedDate, { enabled: !stateData });
  const selectedCategory = stateData || allSectors.find((s) => s.key === categoryKey);

  // 로딩 중이면 스켈레톤, 카테고리 없으면 안내 후 뒤로가기
  if (isLoading && !stateData) {
    return (
      <MobileLayout className="bg-neutral-0">
        <div className="sticky top-0 z-10 w-full bg-white border-b border-neutral-5">
          <BackPageGNB
            title="세부내역"
            onBack={() => navigate(-1)}
            text=""
            className="bg-white"
            titleColor="text-neutral-90"
          />
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="h-[134px] bg-neutral-10 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-neutral-10 rounded animate-pulse" />
          <div className="h-20 bg-neutral-10 rounded animate-pulse" />
        </div>
      </MobileLayout>
    );
  }

  if (!selectedCategory) {
    return (
      <MobileLayout className="bg-neutral-0">
        <div className="sticky top-0 z-10 w-full bg-white border-b border-neutral-5">
          <BackPageGNB
            title="세부내역"
            onBack={() => navigate('/asset/sector', { state: { selectedDate: selectedDate.toISOString() } })}
            text=""
            className="bg-white"
            titleColor="text-neutral-90"
          />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-12 px-5">
          <Typography variant="body-2" color="neutral-50" className="text-center">
            카테고리 정보를 찾을 수 없습니다.
          </Typography>
          <button
            type="button"
            onClick={() => navigate('/asset/sector', { state: { selectedDate: selectedDate.toISOString() } })}
            className="mt-4 text-primary-normal text-sm font-medium"
          >
            카테고리 분석으로 돌아가기
          </button>
        </div>
      </MobileLayout>
    );
  }

  const items = selectedCategory.items ?? [];
  const { key, amount: totalAmount } = selectedCategory;
  const style = CATEGORY_STYLES[key] || CATEGORY_STYLES.default;
  const label = CATEGORY_LABELS[key] || selectedCategory.category || CATEGORY_LABELS.default;

  // 3. 화면 렌더링을 위한 날짜별 그룹화 실행
  const historyData: SectorTransactionGroup[] = transformToDateGroups(items);

  return (
    <MobileLayout className="bg-neutral-0">
      <div className="flex flex-col min-h-screen bg-neutral-0 relative">
        {/* 상단 GNB */}
        <div className="sticky top-0 z-10 w-full bg-white border-b border-neutral-5">
          <BackPageGNB
            title="세부내역"
            onBack={() => {
              navigate('/asset/sector', {
                state: { selectedDate: selectedDate.toISOString() },
                replace: true, // 히스토리가 중복으로 쌓이지 않게 교체
              });
            }}
            text=""
            className="bg-white"
            titleColor="text-neutral-90"
          />
        </div>

        {/* 요약 카드: 카테고리별 테마 컬러(bgColor) 적용 ㅋ */}
        <div className={cn('flex flex-col p-[20px] w-full h-[134px] gap-[12px]', style.bgColor)}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img src={style.icon} alt={label} className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <Typography variant="caption-1" className="text-neutral-70">
              {/* 💡 하드코딩 대신 동적 월 노출 (예: 1월) */}
              {selectedDate.getMonth() + 1}월 {label} 총 금액
            </Typography>
            <Typography variant="headline-1" weight="bold" className="text-neutral-90">
              {formatCurrency(totalAmount)}
            </Typography>
          </div>
        </div>

        {/* 지출 리스트 영역 */}
        <div className="flex-1 flex flex-col px-[20px] mt-[20px] pb-10">
          <Typography variant="body-2" weight="semi-bold" className="text-neutral-90 mb-[12px]">
            총 {items.length}건
          </Typography>

          <div className="flex flex-col gap-[20px]">
            {historyData.map((group: SectorTransactionGroup) => (
              <div key={`${group.date}-${group.day}`} className="flex flex-col">
                {/* 날짜 구분선 헤더 */}
                <AssetDailyHeader date={group.date} dailyTotal={group.dailyTotal} />

                {/* 해당 날짜의 지출 아이템들 ㅋ */}
                <div className="flex flex-col gap-[8px] mt-[8px]">
                  {group.items.map((item: TransactionWithDetails, idx: number) => (
                    <div
                      key={`${group.day}-${item.id}-${idx}`}
                      onClick={() => setSelectedItem(item)}
                      className="cursor-pointer active:bg-neutral-5 rounded-lg transition-colors"
                    >
                      <AssetItemList
                        title={item.title}
                        subTitle={item.sub}
                        amount={item.amount}
                        type={item.type}
                        category={key || 'default'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 거래 내역 상세 모달 (Portal 사용) */}
        {selectedItem && <TransactionDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </div>
    </MobileLayout>
  );
};
