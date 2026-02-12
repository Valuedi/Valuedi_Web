import BottomSheet from '@/shared/components/common/BottomSheet';
import GoalIconPickerBottomSheet from './GoalIconPickerBottomSheet'; // Import the new component
import { useState } from 'react'; // Import useState

interface GoalMoreActionsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEditGoal?: () => void;
  onDeleteGoal?: () => void;
  initialColorId?: string;
  initialIconId?: string;
  onIconChangeConfirm?: (payload: { colorId: string; iconId: string }) => void;
  /** 지난 목표일 때 true → 아이콘 수정/목표 수정 비활성화 */
  isPastGoal?: boolean;
}

const GoalMoreActionsBottomSheet = ({
  isOpen,
  onClose,
  onEditGoal,
  onDeleteGoal,
  initialColorId,
  initialIconId,
  onIconChangeConfirm,
  isPastGoal = false,
}: GoalMoreActionsBottomSheetProps) => {
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const handleClick = (cb?: () => void) => {
    cb?.();
    onClose();
  };

  const handleIconChangeClick = () => {
    if (isPastGoal) return;
    setIsIconPickerOpen(true);
    onClose();
  };

  const handleIconPickerClose = () => {
    setIsIconPickerOpen(false);
  };

  const handleIconPickerConfirm = (payload: { colorId: string; iconId: string }) => {
    onIconChangeConfirm?.(payload);
    setIsIconPickerOpen(false);
  };

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleIconChangeClick}
            disabled={isPastGoal}
            className={`w-full flex items-center gap-3 py-4 text-left ${isPastGoal ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <span className="w-6 flex justify-center text-gray-500">♡</span>
            <span className="text-[16px] font-medium text-gray-700">아이콘 변경하기</span>
          </button>

          <button
            type="button"
            onClick={() => !isPastGoal && handleClick(onEditGoal)}
            disabled={isPastGoal}
            className={`w-full flex items-center gap-3 py-4 text-left ${isPastGoal ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <span className="w-6 flex justify-center text-gray-500">✎</span>
            <span className="text-[16px] font-medium text-gray-700">목표 수정하기</span>
          </button>

          <button
            type="button"
            onClick={() => handleClick(onDeleteGoal)}
            className="w-full flex items-center gap-3 py-4 text-left"
          >
            <span className="w-6 flex justify-center text-red-500">🗑</span>
            <span className="text-[16px] font-medium text-red-500">목표 삭제하기</span>
          </button>
        </div>
      </BottomSheet>

      <GoalIconPickerBottomSheet
        isOpen={isIconPickerOpen}
        onClose={handleIconPickerClose}
        onConfirm={handleIconPickerConfirm}
        initialColorId={initialColorId}
        initialIconId={initialIconId}
      />
    </>
  );
};

export default GoalMoreActionsBottomSheet;
