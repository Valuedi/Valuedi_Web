import { BaseButton } from '@/shared/components/buttons/BaseButton';

interface GoalCreateStepFooterProps {
  isVisible: boolean;
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
}

const GoalCreateStepFooter = ({ isVisible, buttonText, onClick, disabled }: GoalCreateStepFooterProps) => {
  if (!isVisible) return null;

  return (
    <footer className="w-full px-[20px] pb-[32px] flex-shrink-0 border-t border-neutral-20 pt-4">
      <BaseButton
        size="large"
        variant="primary"
        text={buttonText}
        onClick={onClick}
        fullWidth
        disabled={disabled}
        typographyStyle="text-body-1-16-semi-bold"
        className="bg-primary-normal"
      />
    </footer>
  );
};

export default GoalCreateStepFooter;
