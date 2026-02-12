import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { kakaoCallbackApi, ApiError } from '@/features/auth';
import { useAuthStore } from '@/features/auth';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { Typography } from '@/shared/components/typography';
import { getConnectionsApi } from '@/features/connection/connection.api';
import { getFinanceMbtiResultApi } from '@/features/mbti/mbti.api';

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const hasProcessedRef = useRef(false); // 중복 호출 방지

  const code = searchParams.get('code');
  const state = searchParams.get('state'); // 카카오에서 전달한 state

  const kakaoCallbackMutation = useMutation({
    mutationFn: () => {
      // 파라미터 검증
      if (!code || !state) {
        throw new Error('카카오 로그인 정보가 없습니다.');
      }

      // GET /auth/oauth/kakao/callback?code=...&state=... 호출
      return kakaoCallbackApi(code, state);
    },
    onSuccess: async (response) => {
      if (response.result) {
        // accessToken을 스토어/스토리지에 반영 (Refresh Token은 HttpOnly 쿠키로 관리)
        login(response.result.memberId, response.result.accessToken);

        // 로그인 성공 후 상태가 완전히 반영되도록 새로고침
        // 새로고침 후 연동 상태 확인을 위해 플래그 저장
        sessionStorage.setItem('checkConnectionAfterLogin', 'true');
        window.location.reload();
      }
    },
    onError: (error: ApiError | Error) => {
      console.error('카카오 로그인 실패:', error);

      if (error instanceof ApiError) {
        // 400 에러인 경우 입력값 문제이므로 state 제거
        // 500 에러인 경우 서버 문제이므로 state 유지 (재시도 가능)
        if (error.status === 400) {
          sessionStorage.removeItem('kakao_oauth_state');
        }

        // 에러 코드별 메시지 처리
        if (error.code === 'AUTH401_5') {
          alert('보안 인증에 실패했습니다. 다시 시도해주세요.');
        } else if (error.code === 'MEMBER403_1') {
          alert('휴면 상태의 회원입니다.');
        } else if (error.status === 400) {
          alert(`입력값 오류: ${error.message}`);
        } else if (error.status === 500) {
          alert(`서버 오류가 발생했습니다.\n\n${error.message}\n\n잠시 후 다시 시도해주세요.`);
        } else {
          alert(error.message || '카카오 로그인에 실패했습니다.');
        }
      } else {
        alert('카카오 로그인에 실패했습니다.');
      }

      navigate('/login', { replace: true });
    },
  });

  useEffect(() => {
    // 새로고침 후 연동 상태 확인
    const shouldCheckConnection = sessionStorage.getItem('checkConnectionAfterLogin') === 'true';
    if (shouldCheckConnection) {
      sessionStorage.removeItem('checkConnectionAfterLogin');

      // 은행 연동 상태와 금융 MBTI 상태 확인 후 리디렉션
      const checkConnectionAndRedirect = async () => {
        try {
          const [connectionsRes, mbtiRes] = await Promise.allSettled([getConnectionsApi(), getFinanceMbtiResultApi()]);

          // 은행 연동 여부 확인
          const hasBankConnection =
            connectionsRes.status === 'fulfilled' &&
            connectionsRes.value?.result &&
            Array.isArray(connectionsRes.value.result) &&
            connectionsRes.value.result.some((conn) => {
              const businessType = conn.businessType || conn.type;
              return businessType === 'BK';
            });

          // 금융 MBTI 존재 여부 확인
          const hasMbti = mbtiRes.status === 'fulfilled' && !!mbtiRes.value?.result;

          // 디버깅을 위한 로그
          console.log('연동 상태 확인 결과:', {
            hasBankConnection,
            hasMbti,
            connectionsData: connectionsRes?.status === 'fulfilled' ? connectionsRes.value?.result : null,
            mbtiData: mbtiRes?.status === 'fulfilled' ? mbtiRes.value?.result : null,
          });

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
      };

      checkConnectionAndRedirect();
      return;
    }

    // 중복 호출 방지
    if (hasProcessedRef.current) {
      return;
    }

    // 카카오에서 전달한 code와 state 파라미터 확인
    if (code && state) {
      // 중복 호출 방지 플래그 설정
      hasProcessedRef.current = true;

      // 백엔드 콜백 API 호출하여 JWT 토큰 발급 받기
      kakaoCallbackMutation.mutate();
    } else {
      // code나 state가 없으면 로그인 페이지로 리다이렉트
      alert('카카오 로그인 정보가 없습니다.');
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, state]);

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Typography variant="body-1" className="text-neutral-60">
          카카오 로그인 처리 중...
        </Typography>
      </div>
    </MobileLayout>
  );
};

export default KakaoCallbackPage;
