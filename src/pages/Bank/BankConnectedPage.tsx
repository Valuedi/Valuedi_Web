import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BankGNB from '@/shared/components/bank/BankGNB';
import { Typography } from '@/shared/components/typography';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import ConnectedBankItem from '@/shared/components/bank/ConnectedBankItem';
import { getConnectionsApi, Connection } from '@/features/connection/connection.api';
import { ApiResponse } from '@/shared/api';
import { BANKS } from '@/features/bank/constants/banks';
import { getBankIdFromOrganizationCode } from '@/features/connection/constants/organizationCodes';

const BankConnectedPage = () => {
  const navigate = useNavigate();

  // 연결된 은행 목록 조회 (캐시 무효화 후 즉시 새로고침)
  const {
    data: connectionsData,
    isLoading,
    refetch,
  } = useQuery<ApiResponse<Connection[]>>({
    queryKey: ['connections'],
    queryFn: () => getConnectionsApi(),
    staleTime: 0, // 항상 최신 데이터 가져오기
    gcTime: 0, // 캐시 사용 안 함 (React Query v5에서는 gcTime 사용)
  });

  // 페이지 진입 시 데이터 새로고침
  useEffect(() => {
    refetch();
  }, [refetch]);

  // 연결된 은행만 필터링 (businessType이 'BK'인 것만)
  const connectedBanks =
    connectionsData?.result
      ?.filter((conn: Connection) => {
        const businessType = conn.businessType || conn.type; // API 응답 필드명 대응
        return businessType === 'BK';
      })
      .map((conn: Connection) => {
        // organizationCode를 bankId로 변환하여 은행 정보 찾기
        const organizationCode = conn.organizationCode || conn.organization; // API 응답 필드명 대응
        const bankId = organizationCode ? getBankIdFromOrganizationCode(organizationCode) : null;
        const bank = bankId ? BANKS.find((b) => b.id === bankId) : null;
        return bank
          ? { name: bank.name, icon: bank.icon }
          : { name: conn.organizationName || organizationCode || '알 수 없음', icon: undefined };
      }) || [];

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    // 추가 은행 연결 페이지로 이동
    navigate('/bank/additional');
  };

  return (
    <MobileLayout>
      <div className="w-full bg-white">
        <BankGNB onBack={handleBack} />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center justify-center w-[320px] mx-auto mt-[20px]">
        <div className="flex items-center w-full">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90 tracking-[-0.36px] flex-1">
            연결을 완료했어요
          </Typography>
        </div>
      </div>

      {/* Connected Banks List */}
      <div className="flex flex-col items-start w-[320px] mx-auto mt-[80px]">
        {isLoading ? (
          <Typography variant="body-2" className="text-neutral-60">
            로딩 중...
          </Typography>
        ) : connectedBanks.length > 0 ? (
          connectedBanks.map((bank: { name: string; icon?: string }) => (
            <ConnectedBankItem key={bank.name} bankName={bank.name} bankIcon={bank.icon || ''} />
          ))
        ) : (
          <Typography variant="body-2" className="text-neutral-60">
            연결된 은행이 없습니다.
          </Typography>
        )}
      </div>

      {/* Button */}
      <div className="absolute bottom-[41px] left-1/2 transform -translate-x-1/2 w-[320px]">
        <BaseButton variant="primary" size="medium" text="다음으로" fullWidth onClick={handleNext} />
      </div>
    </MobileLayout>
  );
};

export default BankConnectedPage;
