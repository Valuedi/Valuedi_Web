import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';

const LAYOUT_CLASS = 'max-w-none shadow-none sm:max-w-[360px] sm:shadow-lg p-0 overflow-hidden bg-white';
const WRAPPER_CLASS = 'flex flex-col w-full min-h-screen bg-white';

interface GoalEditPageLayoutProps {
  onBack: () => void;
  children: React.ReactNode;
}

export default function GoalEditPageLayout({ onBack, children }: GoalEditPageLayoutProps) {
  return (
    <MobileLayout className={LAYOUT_CLASS}>
      <div className={WRAPPER_CLASS}>
        <BackPageGNB
          title="수정하기"
          text=""
          titleColor="text-neutral-90"
          className="w-full bg-white"
          onBack={onBack}
        />
        {children}
      </div>
    </MobileLayout>
  );
}
