import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthInput from './AuthInput';
import AuthRequestButton from '@/shared/components/buttons/AuthRequestButton';
import { TermsAgreement } from './TermsAgreement';
import { useEmailForm } from '@/shared/hooks/SignUp/useEmailForm';
import { Typography } from '../typography';
import { LoginButton } from '../buttons';
import { signUpApi, ApiError } from '@/features/auth';

// 약관 ID 매핑 - /api/terms 스펙과 동일하게 맞춤
// 1: AGE_14, 2: SERVICE, 3: SECURITY, 4: PRIVACY, 5: MARKETING
const TERMS_ID_MAP: Record<string, number> = {
  age: 1, // 만 14세 이상입니다.
  service: 2, // 밸류디 이용약관 동의
  security: 3, // 밸류디 전자금융거래 이용약관 동의
  privacy: 4, // 밸류디 개인정보 수집 및 이용 동의
  marketing: 5, // 마케팅 목적의 개인정보 수집 및 이용 동의
};

const SignUpEmailContainer = () => {
  const auth = useEmailForm();
  const navigate = useNavigate();
  const [isTermsValid, setIsTermsValid] = useState(false);
  const [termsAgreements, setTermsAgreements] = useState<Record<string, boolean>>({
    age: false,
    service: false,
    security: false,
    privacy: false,
    marketing: false,
  });

  const signUpMutation = useMutation({
    mutationFn: signUpApi,
    onSuccess: () => {
      // 회원가입 성공
      sessionStorage.removeItem('signupData');
      navigate('/login');
    },
    onError: (error: ApiError) => {
      console.error('[SignUp] error', error);
      if (error.code === 'AUTH403_1') {
        alert('이메일 인증이 완료되지 않았습니다.');
      } else if (error.code === 'AUTH409_1') {
        alert('이미 사용 중인 아이디입니다.');
      } else {
        alert(error.message || '회원가입에 실패했습니다.');
      }
    },
  });

  const handleSignUp = async () => {
    const signupDataStr = sessionStorage.getItem('signupData');
    if (!signupDataStr) {
      alert('회원가입 정보를 찾을 수 없습니다. 다시 시도해주세요.');
      navigate('/signup');
      return;
    }

    const signupData = JSON.parse(signupDataStr);

    // 약관 동의 정보 변환 (회원가입 요청용)
    const agreementsForSignUp = Object.entries(termsAgreements).map(([key, isAgreed]) => ({
      termsId: TERMS_ID_MAP[key] || 0,
      isAgreed,
    }));

    console.log('[SignUp] request payload', {
      ...signupData,
      email: auth.email,
      agreements: agreementsForSignUp,
    });

    signUpMutation.mutate({
      ...signupData,
      email: auth.email,
      agreements: agreementsForSignUp,
    });
  };

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
        width="withButton"
        success={auth.verifySuccess}
        error={auth.verifyError}
        readOnly={auth.isVerified}
        timer={auth.isRequested ? auth.timerText : undefined}
        rightElement={
          auth.verifyCode.length === 6 ? (
            <AuthRequestButton text="확인" disabled={auth.isVerified} onClick={auth.confirmVerification} />
          ) : auth.isRequested ? (
            <AuthRequestButton text="재전송" disabled={!auth.canResend} onClick={auth.startVerification} />
          ) : (
            <AuthRequestButton
              text="전송"
              disabled={!auth.email || !!auth.emailError}
              onClick={auth.startVerification}
            />
          )
        }
      />

      {/* 약관 */}
      <div className="w-full mt-4">
        <TermsAgreement
          onRequirementChange={(isValid) => {
            setIsTermsValid(isValid);
          }}
          onTermsChange={setTermsAgreements}
        />
      </div>

      {/* 다음으로 */}
      <div className="flex items-center justify-center w-full mt-8 ">
        <LoginButton
          text={signUpMutation.isPending ? '가입 중...' : '가입하기'}
          className={`border-none rounded-[8px] ${
            !isFormValid || signUpMutation.isPending
              ? 'bg-atomic-yellow-70 cursor-not-allowed text-neutral-40'
              : 'bg-atomic-yellow-50 hover:bg-atomic-yellow-40 text-neutral-100'
          }`}
          disabled={!isFormValid || signUpMutation.isPending}
          onClick={handleSignUp}
        />
      </div>
    </div>
  );
};

export default SignUpEmailContainer;
