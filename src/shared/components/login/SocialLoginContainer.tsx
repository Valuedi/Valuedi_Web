import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components';
import LoginButton from '@/shared/components/buttons/LoginButton';
import KakaoIcon from '@/assets/icons/Kakao.svg?react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { getKakaoLoginUrlApi } from '@/features/auth';
interface SocialLoginContainerProps {
  className?: string;
  onKakaoClick?: () => void;
  onEmailClick?: () => void;
}

const SocialLoginContainer: React.FC<SocialLoginContainerProps> = ({ className }) => {
  const navigate = useNavigate();

  const kakaoLoginMutation = useMutation({
    mutationFn: getKakaoLoginUrlApi,
    onSuccess: (response) => {
      if (response.result) {
        // 카카오 로그인 URL로 리다이렉트
        window.location.href = response.result.url;
      }
    },
    onError: (error) => {
      console.error('카카오 로그인 URL 생성 실패:', error);
      alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleKakaoLogin = () => {
    kakaoLoginMutation.mutate();
  };

  return (
    <div className={cn('flex flex-col items-center justify-center bg-white', className)}>
      {/* 2. 상단 텍스트 영역 */}
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

      {/* 3. 버튼 그룹 영역 (LoginButton 활용) */}
      <div className="flex flex-col gap-3 w-full items-center mt-8">
        {/* 💡 카카오 계정 로그인 버튼 */}
        <LoginButton
          className={cn(
            'border-none rounded-[8px]',
            kakaoLoginMutation.isPending
              ? 'bg-atomic-yellow-70 cursor-not-allowed'
              : 'bg-atomic-yellow-50 hover:bg-atomic-yellow-40 transition-colors'
          )}
          onClick={handleKakaoLogin}
          disabled={kakaoLoginMutation.isPending}
        >
          <div className="flex items-center justify-center gap-2">
            <KakaoIcon className="w-5 h-5 text-black" />
            <Typography variant="body-1" weight="semi-bold" className="text-black">
              카카오 계정으로 계속하기
            </Typography>
          </div>
        </LoginButton>

        {/* 💡 통합 로그인 버튼 */}
        <LoginButton
          text="통합로그인으로 계속하기"
          className={cn('bg-white border border-neutral-90 rounded-[8px]', 'hover:bg-neutral-30 transition-colors')}
          onClick={() => navigate('/login/form')}
        />
      </div>
    </div>
  );
};

export default SocialLoginContainer;
