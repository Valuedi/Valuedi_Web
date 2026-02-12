import { BaseButton } from '@/shared/components/buttons/BaseButton';
import { Typography } from '@/shared/components/typography';

interface GoalLeaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const GoalLeaveConfirmModal = ({ isOpen, onClose, onConfirm }: GoalLeaveConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-neutral-90 opacity-[0.65] z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
        <div className="w-full max-w-[320px] bg-white rounded-xl px-6 py-6 shadow-lg">
          <Typography style="text-body-1-16-semi-bold" fontFamily="pretendard" className="text-neutral-90 text-center">
            작성 중인 내용이 사라집니다
          </Typography>
          <Typography
            style="text-body-2-14-regular"
            fontFamily="pretendard"
            className="text-neutral-60 text-center mt-2"
          >
            정말 나가시겠어요?
          </Typography>

          <div className="mt-6 flex gap-3">
            <BaseButton
              size="custom"
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-[48px] rounded-lg bg-neutral-20 text-neutral-60"
              typographyStyle="text-body-1-16-semi-bold"
              text="취소"
            />

            <BaseButton
              size="custom"
              variant="primary"
              onClick={onConfirm}
              className="flex-1 h-[48px] rounded-lg bg-primary-normal"
              typographyStyle="text-body-1-16-semi-bold"
              text="나가기"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalLeaveConfirmModal;
