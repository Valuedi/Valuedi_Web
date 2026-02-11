import SignUpContainer from '@/shared/components/login/SignUpContainer';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';

const SignupPage = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-10 sm:py-16">
        <div className="w-full max-w-[26.25rem] mx-auto">
          <SignUpContainer />
        </div>
      </div>
    </MobileLayout>
  );
};

export default SignupPage;
