import SignUpEmailContainer from '@/components/signup/SignUpEmailContainer';

const EmailForm = () => {
  return (
    <div className="min-h-dvh flex justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[26.25rem]">
        <SignUpEmailContainer />
      </div>
    </div>
  );
};

export default EmailForm;
