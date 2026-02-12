import SignUpEmailContainer from '@/shared/components/login/SignUpEmailContainer';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';

const EmailForm = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-10 sm:py-16">
        <div className="w-full max-w-[26.25rem] mx-auto">
          <SignUpEmailContainer />
        </div>
      </div>
    </MobileLayout>
  );
};

export default EmailForm;
