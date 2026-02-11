import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import CheckBoxButton from '@/shared/components/buttons/CheckBoxButton';
import { LoginButton } from '@/shared/components/buttons';
import { useAuthStore } from '@/features/auth';
import { agreeTermsApi, getMemberTermsApi, getTermsApi, MemberTermAgreement, TermItem } from '@/features/terms';

interface TermWithState extends TermItem {
  isAgreed: boolean;
}

interface MemberTermsResult {
  agreements: MemberTermAgreement[];
}

export const TermsSettingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const memberId = user?.id;

  const [termsState, setTermsState] = useState<Record<number, boolean>>({});

  const { data: termsRes } = useQuery({
    queryKey: ['termsList'],
    queryFn: getTermsApi,
  });

  const { data: memberTermsRes } = useQuery({
    queryKey: ['memberTerms'],
    queryFn: getMemberTermsApi,
    enabled: !!memberId,
  });

  const termsWithState: TermWithState[] = useMemo(() => {
    const list = termsRes?.result?.termsLists ?? [];
    const rawMemberResult = memberTermsRes?.result as MemberTermsResult | null | undefined;
    const memberAgreements: MemberTermAgreement[] = rawMemberResult?.agreements ?? [];
    const agreedMap: Record<number, MemberTermAgreement> = {};
    memberAgreements.forEach((a) => {
      agreedMap[a.termsId] = a;
    });
    return list.map((t) => {
      const serverAgreed = agreedMap[t.termsId] != null; // agreements 배열에 있으면 동의한 것
      const localOverride = termsState[t.termsId];
      return {
        ...t,
        isAgreed: localOverride !== undefined ? localOverride : serverAgreed,
      };
    });
  }, [termsRes, memberTermsRes, termsState]);

  useEffect(() => {
    if (!memberId) {
      // 로그인 정보가 없으면 마이페이지로 돌려보내기
      navigate('/mypage', { replace: true });
    }
  }, [memberId, navigate]);

  const handleToggle = (term: TermWithState) => {
    const next = !term.isAgreed;
    setTermsState((prev) => ({
      ...prev,
      [term.termsId]: next,
    }));
  };

  const handleApply = async () => {
    if (!memberId) return;

    // 필수 약관이 하나라도 미동의라면 적용 불가
    const hasAllRequiredAgreed = termsWithState.filter((t) => t.isRequired).every((t) => t.isAgreed);

    if (!hasAllRequiredAgreed) {
      alert('필수 약관에 모두 동의해야 합니다.');
      return;
    }

    const agreements = termsWithState.map((term) => ({
      termsId: term.termsId,
      isAgreed: term.isAgreed,
      agreedVersion: '1.0',
    }));

    try {
      console.log('[TermsSettings] agreeTermsApi request', {
        memberId,
        agreements,
      });

      const res = await agreeTermsApi({
        memberId,
        agreements,
      });

      console.log('[TermsSettings] agreeTermsApi response', res);

      // 서버 상태가 변경되었으므로 내 약관 동의 내역 쿼리 무효화 → 재조회
      queryClient.invalidateQueries({ queryKey: ['memberTerms'] });

      // TODO: 필요하면 토스트 등으로 "적용되었습니다" 안내
    } catch (error) {
      console.error('[TermsSettings] agreeTermsApi error', error);
    }
  };

  return (
    <MobileLayout className="bg-white">
      <BackPageGNB
        title="약관 및 마케팅 동의"
        onBack={() => navigate(-1)}
        className="bg-white border-b border-neutral-5"
        titleColor="text-neutral-90"
        text=""
      />

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <Typography variant="body-1" className="text-neutral-70 mb-4">
          서비스 이용을 위한 약관 및 마케팅 동의 상태를 관리할 수 있어요.
        </Typography>

        <div className="flex flex-col divide-y divide-neutral-10">
          {termsWithState.map((term) => (
            <div
              key={term.termsId}
              role="button"
              tabIndex={0}
              onClick={() => handleToggle(term)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggle(term);
                }
              }}
              className="w-full py-3 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex flex-col">
                <Typography variant="body-2" className={cn('text-neutral-90')}>
                  {term.title}
                </Typography>
                <Typography variant="caption-1" className="text-neutral-50 mt-1">
                  {term.isRequired ? '[필수]' : '[선택]'}
                </Typography>
              </div>
              <CheckBoxButton isChecked={term.isAgreed} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-neutral-10">
        {(() => {
          const hasAllRequiredAgreed = termsWithState.filter((t) => t.isRequired).every((t) => t.isAgreed);
          const disabled = !hasAllRequiredAgreed;
          return (
            <LoginButton
              text="적용하기"
              onClick={handleApply}
              disabled={disabled}
              className={cn(
                'w-full border-none rounded-[8px]',
                disabled
                  ? 'bg-atomic-yellow-70 cursor-not-allowed text-neutral-40'
                  : 'bg-atomic-yellow-50 hover:bg-atomic-yellow-40 text-neutral-100'
              )}
            />
          );
        })()}
      </div>
    </MobileLayout>
  );
};

export default TermsSettingsPage;
