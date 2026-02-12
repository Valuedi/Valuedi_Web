import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components';
import { useNavigate } from 'react-router-dom';
import AuthInput from '@/shared/components/login/AuthInput';
import DuplicateCheckButton from '@/shared/components/buttons/DuplicateCheckButton';
import { useAuthForm } from '@/shared/hooks/SignUp/useAuthForm';
import { LoginButton } from '../buttons';

interface SignUpContainerProps {
  className?: string;
}

const SignUpContainer: React.FC<SignUpContainerProps> = ({ className }) => {
  const navigate = useNavigate();
  const auth = useAuthForm();
  const [isRrnFocused, setIsRrnFocused] = React.useState(false);
  const rrnFrontRef = React.useRef<HTMLInputElement>(null);
  const rrnBackRef = React.useRef<HTMLInputElement>(null);

  const isFormValid = !!(
    auth.id &&
    !auth.idError &&
    !auth.idCheckError &&
    auth.idCheckSuccess &&
    auth.userName &&
    !auth.nameError &&
    auth.rrnFront.length === 6 &&
    auth.rrnBack.length === 1 &&
    !auth.rrnError &&
    auth.pw &&
    !auth.pwError &&
    auth.confirmPw &&
    !auth.confirmPwError
  );

  return (
    <div className={cn('flex flex-col items-center bg-white justify-center w-full', className)}>
      {/* 헤더 */}
      <div className="text-center space-y-4 my-4">
        <Typography variant="headline-1" weight="bold" className="text-neutral-100">
          회원가입
        </Typography>
        <Typography variant="body-2" className="text-neutral-60">
          당신을 위한 금융 서비스, 밸류디
        </Typography>
      </div>

      {/* 입력 폼 */}
      <div className="flex flex-col w-full items-center mt-8 gap-3">
        {/* 아이디 + 중복확인 */}
        <AuthInput
          name="userId"
          label="아이디"
          value={auth.id}
          onChange={auth.handleIdChange}
          placeholder="아이디를 입력해주세요."
          success={auth.idCheckSuccess}
          error={auth.idError || auth.idCheckError}
          rightElement={<DuplicateCheckButton disabled={auth.id.length === 0} onClick={auth.handleDuplicateCheck} />}
          width="full"
        />

        {/* 이름 */}
        <AuthInput
          name="userName"
          label="이름"
          value={auth.userName}
          onChange={auth.handleNameChange}
          placeholder="이름을 입력해주세요."
          error={auth.nameError}
          width="full"
        />

        {/* 주민등록번호(6자리-1자리) */}
        <div className="flex flex-col w-[320px] mx-auto">
          <div className="h-[28px] flex items-start mb-0">
            <Typography variant="body-2" weight="semi-bold" className="text-text-body">
              주민등록번호
            </Typography>
          </div>
          <div
            className={cn(
              'flex items-center gap-2 h-[48px] px-[12px] border rounded-[8px] bg-white transition-all',
              auth.rrnError ? 'border-status-error' : isRrnFocused ? 'border-text-title' : 'border-neutral-40'
            )}
          >
            <input
              ref={rrnFrontRef}
              name="rrnFront"
              type="text"
              value={auth.rrnFront}
              onChange={(e) => {
                auth.handleRrnFrontChange(e);
                // 6자리가 입력되면 자동으로 뒷자리로 포커스 이동
                if (e.target.value.length === 6) {
                  rrnBackRef.current?.focus();
                }
              }}
              onFocus={() => setIsRrnFocused(true)}
              onBlur={() => setIsRrnFocused(false)}
              placeholder="000000"
              maxLength={6}
              className={cn(
                'h-full outline-none transition-all text-[14px] font-pretendard flex-1 bg-transparent',
                'placeholder:text-text-body'
              )}
            />
            <span className="text-neutral-60 text-[14px] font-pretendard">-</span>
            <input
              ref={rrnBackRef}
              name="rrnBack"
              type="text"
              value={auth.rrnBack}
              onChange={auth.handleRrnBackChange}
              onKeyDown={(e) => {
                // 백스페이스 키를 누르고 값이 비어있으면 앞자리로 포커스 이동
                if (e.key === 'Backspace' && auth.rrnBack.length === 0) {
                  rrnFrontRef.current?.focus();
                }
              }}
              onFocus={() => setIsRrnFocused(true)}
              onBlur={() => setIsRrnFocused(false)}
              placeholder="0"
              maxLength={1}
              className={cn(
                'h-full outline-none transition-all text-[14px] font-pretendard w-[48px] bg-transparent',
                'placeholder:text-text-body'
              )}
            />
          </div>
          {auth.rrnError && (
            <div className="my-1.5 ml-2 flex items-start">
              <Typography variant="caption-2" weight="medium" className="text-status-error">
                {auth.rrnError}
              </Typography>
            </div>
          )}
          {!auth.rrnError && <div className="h-[24px]" />}
        </div>

        {/* 비밀번호 + 확인 */}
        <div className="flex flex-col w-full items-center">
          <AuthInput
            name="password"
            label="비밀번호"
            type="password"
            value={auth.pw}
            onChange={auth.handlePwChange}
            placeholder="비밀번호를 입력해주세요."
            error={auth.pwError}
            isDouble={true}
            width="full"
          />
          <AuthInput
            name="confirmPassword"
            type="password"
            value={auth.confirmPw}
            onChange={auth.handleConfirmPwChange}
            placeholder="비밀번호를 다시 한 번 입력해주세요."
            error={auth.confirmPwError}
            success={auth.confirmPwSuccess}
            width="full"
          />
        </div>
      </div>

      {/* 다음으로 */}
      <div className="w-full mt-8 flex justify-center">
        <LoginButton
          text="다음으로"
          className={cn(
            'border-none rounded-[8px]',
            !isFormValid
              ? 'bg-atomic-yellow-70 cursor-not-allowed text-neutral-40'
              : 'bg-atomic-yellow-50 hover:bg-atomic-yellow-40 text-neutral-100'
          )}
          disabled={!isFormValid}
          onClick={() => {
            // 회원가입 정보를 sessionStorage에 저장
            const signupData = {
              username: auth.id,
              realName: auth.userName,
              rrnPrefix: auth.rrnFront + auth.rrnBack,
              password: auth.pw,
            };
            sessionStorage.setItem('signupData', JSON.stringify(signupData));
            navigate('/signup/email');
          }}
        />
      </div>
    </div>
  );
};

export default SignUpContainer;
