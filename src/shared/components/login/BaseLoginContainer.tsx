import React, { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import AuthInput from '@/shared/components/login/AuthInput';
import LoginButton from '@/shared/components/buttons/LoginButton';
import { useAuthForm } from '@/shared/hooks/SignUp/useAuthForm';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginApi, ApiError } from '@/features/auth';
import { useAuthStore } from '@/features/auth';
import { getConnectionsApi } from '@/features/connection/connection.api';
import { getFinanceMbtiResultApi } from '@/features/mbti/mbti.api';

interface BaseLoginContainerProps {
  className?: string;
  onLogin?: (id: string, pw: string) => void;
}

const BaseLoginContainer: React.FC<BaseLoginContainerProps> = ({ className, onLogin }) => {
  const auth = useAuthForm();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loginError, setLoginError] = useState<string>('');
  const isFormValid = auth.id.length > 0 && auth.pw.length > 0 && !auth.idError && !auth.pwError;

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (response) => {
      if (response.result) {
        // accessToken + refreshToken(선택적)을 모두 스토어/스토리지에 반영
        login(response.result.memberId, response.result.accessToken, response.result.refreshToken);

        // 은행 연동 상태와 금융 MBTI 상태 확인 후 리디렉션
        try {
          const [connectionsRes, mbtiRes] = await Promise.allSettled([getConnectionsApi(), getFinanceMbtiResultApi()]);

          // 은행 연동 여부 확인
          const hasBankConnection =
            connectionsRes.status === 'fulfilled' &&
            connectionsRes.value?.result?.some((conn) => (conn.businessType || conn.type) === 'BK');

          // 금융 MBTI 존재 여부 확인
          const hasMbti = mbtiRes.status === 'fulfilled' && !!mbtiRes.value?.result;

          // 조건에 따라 리디렉션
          if (hasBankConnection && hasMbti) {
            // 은행 연동 + 금융 MBTI 존재 → 홈으로
            navigate('/home', { replace: true });
          } else if (hasBankConnection && !hasMbti) {
            // 은행만 연동 → 금융 MBTI 페이지로
            navigate('/mbti', { replace: true });
          } else {
            // 둘 다 없음 → 은행 연동 시작 페이지로
            navigate('/bank/start', { replace: true });
          }
        } catch (error) {
          // 에러 발생 시 기본적으로 은행 연동 시작 페이지로 이동
          console.error('연동 상태 확인 실패:', error);
          navigate('/bank/start', { replace: true });
        }
      }
    },
    onError: (error: ApiError) => {
      if (error.status === 401) {
        setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.status === 403) {
        setLoginError(error.message || '휴면 상태의 회원입니다.');
      } else {
        setLoginError(error.message || '로그인에 실패했습니다.');
      }
    },
  });

  const handleLogin = () => {
    if (!isFormValid) return;
    setLoginError('');
    loginMutation.mutate({
      username: auth.id.toLowerCase(),
      password: auth.pw,
    });
    onLogin?.(auth.id.toLowerCase(), auth.pw);
  };

  return (
    <div className={cn('flex flex-col items-center bg-white ', className)}>
      {/* 1. 상단 텍스트 영역 */}
      <div className="text-center space-y-4 my-4">
        <div className="space-y-1">
          <Typography variant="headline-2" weight="bold" className="text-neutral-100">
            로그인하고
          </Typography>
          <Typography variant="headline-2" weight="bold" className="text-neutral-100">
            금융 목표를 이뤄보세요.
          </Typography>
        </div>
        <Typography variant="body-2" className="text-neutral-60">
          당신을 위한 금융 서비스, 밸류디
        </Typography>
      </div>

      {/* 2. 입력 폼 영역 */}
      <div className="flex flex-col gap-3 w-full items-center mt-8">
        <AuthInput
          label="아이디"
          name="id"
          value={auth.id}
          onChange={auth.handleIdChange}
          placeholder="아이디를 입력해주세요."
          error={auth.idError}
          width="full"
        />
        <AuthInput
          label="비밀번호"
          name="pw"
          type="password"
          value={auth.pw}
          onChange={auth.handlePwChange}
          placeholder="비밀번호를 입력해주세요."
          error={auth.pwError || loginError}
          width="full"
        />
      </div>

      {/* 3. 로그인 버튼 영역 */}
      <div className="w-full">
        <LoginButton
          text={loginMutation.isPending ? '로그인 중...' : '로그인'}
          className={cn(
            'border-none rounded-[8px]',
            !isFormValid || loginMutation.isPending
              ? 'bg-atomic-yellow-70 cursor-not-allowed'
              : 'bg-atomic-yellow-50 hover:bg-atomic-yellow-40'
          )}
          disabled={!isFormValid || loginMutation.isPending}
          onClick={handleLogin}
        />
      </div>

      {/* 4. 하단 유틸리티 링크 */}
      <div className="flex items-center justify-between w-full mt-2">
        <div className="flex items-center gap-2">
          <button type="button" className="hover:underline text-neutral-60">
            <Typography variant="caption-1">아이디 찾기</Typography>
          </button>
          <div className="w-[1px] h-[10px] bg-neutral-20" />
          <button type="button" className="hover:underline text-neutral-60">
            <Typography variant="caption-1">비밀번호 찾기</Typography>
          </button>
        </div>
        <button type="button" className="hover:underline text-neutral-80" onClick={() => navigate('/signup')}>
          <Typography variant="caption-1">회원가입</Typography>
        </button>
      </div>
    </div>
  );
};

export default BaseLoginContainer;
