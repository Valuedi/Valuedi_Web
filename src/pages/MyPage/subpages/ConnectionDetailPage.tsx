import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { cn } from '@/shared/utils/cn';
import { getConnectionsApi, deleteConnectionApi, ApiError } from '@/features/connection/connection.api';
import { BANKS } from '@/features/bank/constants/banks';
import { CARDS } from '@/features/card/constants/cards';
import {
  getBankIdFromOrganizationCode,
  getCardIdFromOrganizationCode,
} from '@/features/connection/constants/organizationCodes';
import { Toast } from '@/shared/components/common/Toast';

// 분리한 컴포넌트들 불러오기
import { ConnectionHeader } from '@/pages/MyPage/components/ConnectionHeader';
import { ConnectionList } from '@/pages/MyPage/components/ConnectionList';
import { ConnectedGoalsSection } from '@/pages/MyPage/components/ConnectedGoalsSection';
import { ConnectionFooter } from '@/pages/MyPage/components/ConnectionFooter';
import { assetApi } from '@/features/asset';

export const ConnectionDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [errorToast, setErrorToast] = useState({ isOpen: false, message: '' });

  // 이전 페이지에서 전달받은 은행/카드 이름 (기본값: 국민은행)
  const bankName = location.state?.bankName || '국민은행';
  const isCard = bankName.includes('카드');

  // 연결 목록 조회
  const { data: connectionsData } = useQuery({
    queryKey: ['connections'],
    queryFn: () => getConnectionsApi(),
  });

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ['assets', 'accounts'],
    queryFn: () => assetApi.getAccounts(),
    enabled: !isCard, // 은행 상세 페이지일 때만 계좌/목표 조회
  });

  // 현재 은행/카드에 해당하는 connectionId 찾기
  const currentConnection = connectionsData?.result?.find((conn) => {
    const businessType = conn.businessType || conn.type; // API 응답 필드명 대응
    const organizationCode = conn.organizationCode || conn.organization; // API 응답 필드명 대응

    if (isCard) {
      const card = CARDS.find((c) => c.name === bankName);
      if (!card) return false;
      // organizationCode를 cardId로 변환하여 비교
      const cardId = organizationCode ? getCardIdFromOrganizationCode(organizationCode) : null;
      return cardId === card.id && businessType === 'CD';
    } else {
      const bank = BANKS.find((b) => b.name === bankName);
      if (!bank) return false;
      // organizationCode를 bankId로 변환하여 비교
      const bankId = organizationCode ? getBankIdFromOrganizationCode(organizationCode) : null;
      return bankId === bank.id && businessType === 'BK';
    }
  });

  const connectedGoals = useMemo(() => {
    // 1. 데이터가 없거나 카드 페이지면 빈 배열 반환
    if (!accountsData?.result?.accountList || isCard) return [];

    // 2. 현재 상세페이지 기관 코드 추출 (organizationCode와 organization 모두 대응)
    const currentOrg = currentConnection?.organizationCode || currentConnection?.organization;

    return accountsData.result.accountList
      .filter((acc) => {
        // 3. 기관 코드가 일치하고 + goalInfo가 null이 아닌 것만 필터링
        const isSameBank = acc.organization === currentOrg;
        const hasGoal = acc.goalInfo !== null;
        return isSameBank && hasGoal;
      })
      .map((acc) => {
        // 4. 위에서 null 체크를 했으므로 안전하게 접근 (acc.goalInfo!)
        const goal = acc.goalInfo!;
        return {
          id: String(goal.goalId),
          title: goal.title,
          subText: acc.accountName,
        };
      });
  }, [accountsData, currentConnection, isCard]);

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (connectionId: number) => deleteConnectionApi(connectionId),
    onSuccess: () => {
      // 연결 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['connections'] });

      // 목록 페이지로 이동하면서 토스트 표시
      navigate('/mypage/connection', {
        state: {
          shouldShowToast: true,
        },
      });
    },
    onError: (error: ApiError | Error) => {
      console.error('연동 해제 실패:', error);

      let errorMessage = '연동 해제에 실패했습니다.';
      if (error instanceof ApiError) {
        errorMessage = error.message || errorMessage;
        if (error.code === 'CONNECTION404_1') {
          errorMessage = '해당 연동 정보를 찾을 수 없습니다.';
        }
      }

      // 에러 토스트 표시 (자동 닫기 비활성화, 사용자가 직접 닫을 수 있도록)
      setErrorToast({ isOpen: true, message: errorMessage });
    },
  });

  /**
   * 💡 삭제 버튼 클릭 시 실행될 함수
   * 모달에서 확인 버튼을 누르면 호출됨
   */
  const handleDelete = () => {
    if (!currentConnection) {
      setErrorToast({ isOpen: true, message: '연동 정보를 찾을 수 없습니다.' });
      setTimeout(() => setErrorToast({ isOpen: false, message: '' }), 3000);
      return;
    }

    // 모달에서 이미 확인했으므로 바로 삭제 실행
    deleteMutation.mutate(currentConnection.connectionId);
  };

  return (
    <MobileLayout className={cn('bg-white flex flex-col h-screen overflow-hidden')}>
      {/* 상단 GNB */}
      <BackPageGNB
        title="연결 관리"
        text=""
        className="bg-white text-neutral-90 border-b border-neutral-5"
        onBack={() => navigate(-1)}
      />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* 1. 상단 브랜드 헤더 */}
        <ConnectionHeader bankName={bankName} connectedAt={currentConnection?.connectedAt} />

        {/* 2. 연결된 항목 리스트 */}
        <ConnectionList bankName={bankName} organizationCode={currentConnection?.organizationCode || ''} />

        {!isCard && (
          <>
            {/* 💡 섹션 구분 회색 바 */}
            <div className="h-2 bg-neutral-10 w-full" />

            {/* 3. 연결된 목표 섹션 */}
            <div className="px-5 py-10">
              <ConnectedGoalsSection goals={connectedGoals} isLoading={isLoading} />
            </div>
          </>
        )}

        {/* 4. 하단 푸터 (삭제 함수 전달) */}
        <ConnectionFooter onDelete={handleDelete} />
      </div>

      {/* 에러 토스트 */}
      <Toast
        message={errorToast.message}
        isOpen={errorToast.isOpen}
        onClose={() => setErrorToast({ isOpen: false, message: '' })}
        autoClose={false}
      />
    </MobileLayout>
  );
};
