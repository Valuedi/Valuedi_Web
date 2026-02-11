import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { Typography } from '@/shared/components';
import { LoginButton } from '@/shared/components/buttons';
import { cn } from '@/shared/utils/cn';
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
    <MobileLayout className={cn('bg-neutral-0 flex flex-col h-screen')}>
      {/* 상단 GNB */}
      <BackPageGNB
        title="로그아웃"
        onBack={handleCancel}
        className="bg-neutral-0"
        titleColor="text-neutral-90"
        text=""
      />

      <div className={cn('flex flex-col flex-1 px-[20px] justify-between')}>
        {/* 상단 타이틀 및 설명 영역 */}
        <div className={cn('flex flex-col gap-[12px] mt-[20px]')}>
          <Typography style="text-headline-3-18-semi-bold" className={cn('text-neutral-90')}>
            밸류디를
            <br />
            로그아웃하시겠어요?
          </Typography>
          <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
            로그아웃 시 모든 전송요구는 철회되며,
            <br />
            개인신용정보 또한 모두 삭제됩니다.
          </Typography>
        </div>

        {/* 하단 버튼 영역 */}
        <div className={cn('flex flex-col items-center justify-center pb-[40px] gap-[8px]')}>
          <button type="button" onClick={handleCancel} className={cn('cursor-pointer px-[10px] py-[8px]')}></button>

          <LoginButton text="로그아웃하기" onClick={handleLogout} className="text-neutral-90 border-none" />
        </div>
      </div>
    </MobileLayout>
  );
};
