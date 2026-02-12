import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { Typography } from '@/shared/components';
import { LoginButton } from '@/shared/components/buttons';
import { logoutApi } from '@/features/auth';
import { useAuthStore } from '@/features/auth';

export const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      // 에러가 발생해도 로컬에서 로그아웃 처리
      console.error('로그아웃 API 실패:', error);
      logout();
      navigate('/login', { replace: true });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지(설정)로 돌아가기
  };

  return (
    <MobileLayout className="bg-white">
      {/* 상단 GNB */}
      <BackPageGNB
        title="로그아웃"
        onBack={handleCancel}
        className="bg-white border-b border-neutral-5"
        titleColor="text-neutral-90"
        text=""
      />

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-3 mt-4">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90">
            밸류디를
            <br />
            로그아웃하시겠어요?
          </Typography>
          <Typography style="text-body-2-14-regular" className="text-neutral-70">
            로그아웃 시 모든 전송요구는 철회되며,
            <br />
            개인신용정보 또한 모두 삭제됩니다.
          </Typography>
        </div>
      </div>

      {/* 하단 버튼 영역 (약관 페이지와 동일하게 전체 폭) */}
      <div className="px-5 py-4">
        <LoginButton
          text="로그아웃하기"
          onClick={handleLogout}
          className="w-full border-none rounded-[8px] bg-atomic-yellow-50 hover:bg-atomic-yellow-40 text-neutral-100"
        />
      </div>
    </MobileLayout>
  );
};
