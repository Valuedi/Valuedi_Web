import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { Typography } from '@/shared/components';
import { LoginButton } from '@/shared/components/buttons';
import CheckBoxButton from '@/shared/components/mypage/WithdrawCheckBoxButton';
import { cn } from '@/shared/utils/cn';
import { removeAccessToken } from '@/shared/api';
import { withdrawMemberApi, WithdrawReasonCode } from '@/features/auth/auth.api';

const WITHDRAW_REASONS = [
  '금융 관리에 도움이 되지 않았어요',
  '사용이 어려워요',
  '필요한 기능이 없어요',
  '보안이 걱정돼요',
  '오류가 자주 발생해요',
  '기타',
];

const WITHDRAW_REASON_CODE_MAP: Record<string, WithdrawReasonCode> = {
  '금융 관리에 도움이 되지 않았어요': 'NOT_HELPFUL',
  '사용이 어려워요': 'DIFFICULT_TO_USE',
  '필요한 기능이 없어요': 'MISSING_FEATURES',
  '보안이 걱정돼요': 'SECURITY_CONCERNS',
  '오류가 자주 발생해요': 'FREQUENT_ERRORS',
  기타: 'OTHER',
};

export const WithdrawPage = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!selectedReason) return;

    const reasonCode = WITHDRAW_REASON_CODE_MAP[selectedReason];
    if (!reasonCode) return;

    try {
      console.log('[Withdraw] DELETE /api/users/me request', { reason: reasonCode });
      await withdrawMemberApi({ reason: reasonCode });
      console.log('[Withdraw] DELETE /api/users/me success');

      // 로컬 토큰 제거
      removeAccessToken();

      // TODO: 전역 상태가 있다면 여기서도 초기화 필요

      navigate('/login', { replace: true });
    } catch (error) {
      console.error('[Withdraw] error 회원 탈퇴 중 오류가 발생했습니다.', error);
      // TODO: 사용자에게 토스트/모달로 에러 안내
    }
  };

  return (
    <MobileLayout className="bg-white">
      {/* 1. 상단 GNB */}
      <BackPageGNB
        title="탈퇴하기"
        onBack={() => navigate(-1)}
        className="bg-white border-b border-neutral-5"
        titleColor="text-neutral-90"
        text=""
      />

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-3 mt-4">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90">
            밸류디를 떠나는 사유를
            <br />
            선택해 주세요
          </Typography>
        </div>

        {/* 탈퇴 사유 리스트 영역 (약관 페이지처럼 전체 폭 사용) */}
        <div className="w-full mt-4">
          {WITHDRAW_REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <div
                key={reason}
                role="button"
                tabIndex={0}
                className="w-full flex items-center py-3 px-4 text-left bg-white active:bg-neutral-3 cursor-pointer"
                onClick={() => setSelectedReason(reason)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedReason(reason);
                  }
                }}
              >
                <CheckBoxButton isChecked={isSelected} className="mr-3 shrink-0" />
                <Typography variant="body-2" weight="medium" className="flex-1 text-neutral-90">
                  {reason}
                </Typography>
              </div>
            );
          })}
        </div>

        {/* 하단 안내 문구 박스 */}
        <div className="bg-neutral-10 p-4 rounded-xl mt-6">
          <Typography variant="caption-1" className="text-neutral-50 leading-[18px] tracking-[-0.02em]">
            밸류디 탈퇴 시 모든 전송요구는 철회되며, 회원 탈퇴와 동시에 서비스 이용이 종료됩니다. 밸류디는 원칙적으로
            이용자의 개인정보를 회원 탈퇴 시까지 보유하며, 회원 탈퇴 시 그동안 수집한 개인신용정보는 모두 삭제됩니다.
            다만, 관련 법령 준수, 부정 이용 및 남용 방지, 분쟁 및 민원 처리를 위해 필요한 최소한의 개인정보는 최대 5년간
            보관될 수 있습니다.
            <br />
            자세한 내용은<span className="underline cursor-pointer ml-1">개인정보처리방침</span>을 참고하시기 바랍니다.
          </Typography>
        </div>
      </div>

      {/* 4. 하단 버튼 영역 (약관 페이지와 동일한 패턴) */}
      <div className="px-5 py-4">
        <LoginButton
          text="탈퇴하기"
          onClick={handleWithdraw}
          disabled={!selectedReason}
          className={cn(
            'w-full border-none rounded-[8px]',
            selectedReason
              ? 'bg-atomic-yellow-50 hover:bg-atomic-yellow-40 text-neutral-100'
              : 'bg-atomic-yellow-70 cursor-not-allowed text-neutral-40'
          )}
        />
      </div>
    </MobileLayout>
  );
};
