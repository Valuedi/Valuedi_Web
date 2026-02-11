import BottomSheet from '@/shared/components/common/BottomSheet';
import WriteIcon from '@/assets/icons/goal/WriteIcon.svg';
import type { TransactionItem } from '@/shared/utils/goal/ledgerHelpers';

interface GoalBottomSheetProps {
  isOpen: boolean;
  item: TransactionItem | null;
  onClose: () => void;
}

const GoalBottomSheet = ({ isOpen, item, onClose }: GoalBottomSheetProps) => {
  if (!item) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={item.type}>
      <div className="relative p-2 py-4 mb-3 border border-gray-200 rounded-xl">
        <input
          type="text"
          placeholder="메모를 남겨주세요 (최대 20자)"
          className="w-full text-base outline-none placeholder:text-gray-400"
        />
        <img src={WriteIcon} alt="edit memo" className="absolute w-5 h-5 right-4 top-4 opacity-40" />
      </div>

      <div className="mb-12 space-y-6">
        <DetailRow label="거래시간" value={item.time} />
        <DetailRow label="거래구분" value={item.category} />
        <DetailRow label="거래금액" value={item.amount.replace(/[-+]/g, '').trim()} isBold />
        <DetailRow label="거래 후 잔액" value={item.balanceAfter} isBold />
        <DetailRow label="입금계좌" value={item.account} />
      </div>

      <button
        onClick={onClose}
        className="w-full rounded-2xl bg-primary-normal py-5 text-lg font-bold transition-transform active:scale-[0.98]"
      >
        확인하기
      </button>
    </BottomSheet>
  );
};

const DetailRow = ({ label, value, isBold }: { label: string; value: string; isBold?: boolean }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`${isBold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{value}</span>
  </div>
);

export default GoalBottomSheet;
