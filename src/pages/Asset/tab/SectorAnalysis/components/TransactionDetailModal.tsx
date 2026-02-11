import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import PenIcon from '@/assets/icons/asset/Pen.svg';
import BottomSheet from '@/shared/components/common/BottomSheet'; // 💡 공통 바텀시트 임포트
import { TransactionWithDetails, TransactionDetail } from '../utils/sectorUtils';

interface TransactionDetailModalProps {
  item: TransactionWithDetails;
  onClose: () => void;
}

export const TransactionDetailModal = ({ item, onClose }: TransactionDetailModalProps) => {
  // 💡 데이터가 없으면 렌더링하지 않음
  if (!item) return null;

  return (
    <BottomSheet
      isOpen={!!item}
      onClose={onClose}
      // title={} 💡 필요하다면 여기에 "상세 내역" 같은 타이틀을 넣으세요!
    >
      {/* 💡 기존 모달 내부 레이아웃 유지 
         BottomSheet 내부에 이미 패딩이 있으므로 px-5 등은 상황에 맞게 조절했습니다. ㅋ
      */}
      <div className="flex flex-col w-full">
        <div className="flex flex-col">
          {/* 제목 영역 */}
          <Typography
            variant="body-1"
            weight="semi-bold"
            fontFamily="pretendard"
            color="neutral-90"
            className="mt-3 mb-4"
          >
            {item.title}
          </Typography>

          {/* 메모 입력창 */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="메모를 남겨주세요 (최대 20자)"
              className={cn(
                'w-full bg-neutral-5 rounded-lg px-4 py-3.5 text-sm outline-none transition-all',
                'border border-neutral-20 focus:border-primary-normal',
                'placeholder:text-neutral-50 text-neutral-90'
              )}
            />
            <img
              src={PenIcon}
              alt="edit"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            />
          </div>

          {/* 상세 정보 리스트 */}
          <div className="flex flex-col gap-8">
            {item.displayDetails?.map((detail: TransactionDetail, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <Typography variant="body-2" weight="regular" color="neutral-70" fontFamily="pretendard">
                  {detail.label}
                </Typography>

                <Typography
                  variant="body-2"
                  weight="regular"
                  color="neutral-90"
                  fontFamily="pretendard"
                  className={detail.isBold ? 'font-bold' : ''}
                >
                  {detail.value}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 확인 버튼 */}
        <div className="pt-10 pb-2">
          <BaseButton
            text="확인하기"
            variant="primary"
            fullWidth
            onClick={onClose}
            className="h-[54px] rounded-xl"
            typographyStyle="text-body-1-16-semi-bold"
          />
        </div>
      </div>
    </BottomSheet>
  );
};
