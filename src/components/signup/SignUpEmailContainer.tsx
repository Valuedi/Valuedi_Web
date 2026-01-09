import { useState } from 'react';
import AuthInput from '../login/AuthInput';
import AuthRequestButton from '@/components/buttons/AuthRequestButton';
import { TermsAgreement } from '../login/TermsAgreement';
import { useEmailForm } from '@/hooks/SignUp/useEmailForm';
import { Typography } from '../typography';
import { LoginButton } from '../buttons';

const SignUpEmailContainer = () => {
  const auth = useEmailForm();
  const [isTermsValid, setIsTermsValid] = useState(false);

  const isFormValid =
    !!auth.email &&
    !auth.emailError &&
    auth.isRequested &&
    auth.verifyCode.length === 6 &&
    auth.isVerified &&
    isTermsValid;

  return (
    <div className="w-full flex flex-col">
      {/* 헤더 */}
      <div className="text-center space-y-4 my-4">
        <Typography variant="headline-2" weight="bold" className="text-neutral-100">
          회원가입
        </Typography>
        <Typography variant="body-2" className="text-neutral-60">
          당신을 위한 금융 서비스, 밸류디
        </Typography>
      </div>

      {/* 이메일 */}
      <AuthInput
        name="userEmail"
        label="이메일"
        value={auth.email}
        onChange={auth.handleEmailChange}
        placeholder="이메일을 입력해주세요."
        error={auth.emailError}
        width="full"
      />

      {/* 인증번호 */}
      <AuthInput
          name="verifyCode"
          label="인증번호"
          value={auth.verifyCode}
          onChange={auth.handleVerifyCodeChange}
          placeholder="인증번호를 입력해주세요."
          success={auth.verifySuccess}
          error={auth.verifyError}
          readOnly={auth.isVerified}
          timer={auth.timerText}
          rightElement={
          auth.verifyCode.length === 6 ? (
            <AuthRequestButton disabled={auth.isVerified} onClick={auth.confirmVerification} />
          ) : (
            <AuthRequestButton disabled={!auth.canResend} onClick={auth.startVerification} />
          )
        }
      />

      {/* 약관 */}
      <div className="w-full mt-4">
        <TermsAgreement onRequirementChange={setIsTermsValid} />
      </div>

      {/* 다음으로 */}
      <div className="flex items-center justify-center w-full mt-8 ">
        <LoginButton
          text="다음으로"
          className={`border-none rounded-[8px] ${
            !isFormValid
              ? 'bg-atomic-yellow-70 cursor-not-allowed text-neutral-40'
              : 'bg-atomic-yellow-50 hover:bg-atomic-yellow-40 text-neutral-100'
          }`}
          disabled={!isFormValid}
          onClick={() => console.log('click')}
        />
      </div>
    </div>
  );
};

export default SignUpEmailContainer;
