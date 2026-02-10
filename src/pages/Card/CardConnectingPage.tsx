import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MobileLayout } from '@/components/layout/MobileLayout';
import CardGNB from '@/components/card/CardGNB';
import { Typography } from '@/components/typography';
import { createConnectionApi, ApiError } from '@/features/connection/connection.api';
import { getCardOrganizationCode } from '@/features/connection/constants/organizationCodes';
import { useUserName } from '@/hooks/useUserName';

const CardConnectingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get('card');
  const userName = useUserName();

  const loginId = (location.state as { loginId?: string })?.loginId || '';
  const loginPassword = (location.state as { loginPassword?: string })?.loginPassword || '';

  const [hasCalledApi, setHasCalledApi] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const connectionMutation = useMutation({
    mutationFn: () => {
      if (!cardId || !loginId || !loginPassword) {
        throw new Error('필수 정보가 누락되었습니다.');
      }

      // cardId를 기관 코드로 변환
      const organizationCode = getCardOrganizationCode(cardId);
      if (!organizationCode) {
        throw new Error('지원하지 않는 카드사입니다.');
      }

      return createConnectionApi({
        organization: organizationCode,
        businessType: 'CD',
        loginId,
        loginPassword,
      });
    },
    onSuccess: () => {
      // 연결 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['connections'] });

      // 연결 성공 시 체크마크 표시 후 연결 완료 페이지로 이동
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/card/connected?card=${cardId}`, { replace: true });
      }, 1000); // 1초 후 이동
    },
    onError: (error: ApiError | Error) => {
      console.error('카드 연결 실패:', error);
      navigate(-1); // 이전 페이지로 돌아가기
    },
  });

  useEffect(() => {
    // API 호출은 한 번만 실행
    if (!hasCalledApi && cardId && loginId && loginPassword) {
      setHasCalledApi(true);
      connectionMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, loginId, loginPassword, hasCalledApi]);

  const isLoading = connectionMutation.isPending && !isSuccess;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MobileLayout>
      <style>
        {`
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      <div className="w-full bg-white">
        <CardGNB onBack={handleBack} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[12px] items-center justify-center w-[320px] mx-auto mt-[20px]">
        <div className="flex items-center w-full">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90 tracking-[-0.36px] flex-1">
            <p className="mb-0">{userName}님의 카드를</p>
            <p>연결 중이에요</p>
          </Typography>
        </div>
        <Typography variant="body-2" weight="regular" className="text-neutral-70 w-full">
          {isSuccess ? '연결이 완료되었습니다!' : isLoading ? '잠시만 기다려주세요...' : '최대 1분정도 걸릴 수 있어요'}
        </Typography>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center mt-[125px]">
        <div className="relative w-[182px] h-[182px]">
          {/* Outer circle */}
          <div className="absolute inset-0 border-4 border-neutral-20 rounded-full" />
          {/* Spinning circle */}
          <div
            className={`absolute inset-0 border-4 border-transparent border-t-primary-main rounded-full animate-spin ${
              isLoading ? '' : 'opacity-0'
            }`}
            style={{ animationDuration: '1s' }}
          />
          {/* Center circle */}
          <div className="absolute inset-[20%] bg-neutral-5 rounded-full flex items-center justify-center">
            {isSuccess ? (
              <div
                className="w-8 h-8 bg-primary-main rounded-full flex items-center justify-center"
                style={{
                  animation: 'scaleIn 0.3s ease-out',
                }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : isLoading ? (
              <div className="w-8 h-8 border-2 border-primary-main border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-8 h-8 border-2 border-neutral-20 rounded-full" />
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CardConnectingPage;
