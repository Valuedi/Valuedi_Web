import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MobileLayout } from '@/components/layout/MobileLayout';
import BankGNB from '@/components/bank/BankGNB';
import { Typography } from '@/components/typography';
import { BaseButton } from '@/components/buttons/BaseButton';
import { BANKS } from '@/features/bank/constants/banks';
import { getConnectionsApi } from '@/features/connection/connection.api';
import { getBankIdFromOrganizationCode } from '@/features/connection/constants/organizationCodes';
import BankInfiniteGrid from '@/components/bank/BankInfiniteGrid';

const BankAdditionalConnectionPage = () => {
  const navigate = useNavigate();

  // 연결된 은행 목록 조회
  const { data: connectionsData } = useQuery({
    queryKey: ['connections'],
    queryFn: () => getConnectionsApi(),
  });

  // 이미 연결된 은행 ID 목록
  const connectedBankIds =
    connectionsData?.result
      ?.filter((conn) => {
        const businessType = conn.businessType || conn.type;
        return businessType === 'BK';
      })
      .map((conn) => {
        const organizationCode = conn.organizationCode || conn.organization;
        return organizationCode ? getBankIdFromOrganizationCode(organizationCode) : null;
      })
      .filter((id): id is string => id !== null) || [];

  // 연결되지 않은 은행만 필터링
  const availableBanks = BANKS.filter((bank) => !connectedBankIds.includes(bank.id));

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddMore = () => {
    // 은행 선택 페이지로 이동
    navigate('/bank/select');
  };

  const handleSkip = () => {
    // 카드 연결 페이지로 이동
    navigate('/card/start');
  };

  return (
    <MobileLayout>
      <div className="w-full bg-white">
        <BankGNB onBack={handleBack} />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-[12px] items-center justify-center w-[320px] mx-auto mt-[20px]">
        <div className="flex items-center w-full">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90 tracking-[-0.36px]">
            <p className="mb-0">추가로 연결하고 싶은</p>
            <p>은행이 있나요?</p>
          </Typography>
        </div>
        <Typography variant="body-2" weight="regular" className="text-neutral-70 w-full">
          여러 은행을 연결하면 더 정확한 소비 분석이 가능해요
        </Typography>
      </div>

      {/* Bank Grid - 3개 행, 각 행은 가로 무한 스크롤 애니메이션 */}
      <BankInfiniteGrid availableBanks={availableBanks} />

      {/* Skip Button */}
      <div className="absolute bottom-[89px] left-1/2 transform -translate-x-1/2 w-[320px] flex items-center justify-center px-[10px] py-[8px]">
        <button type="button" onClick={handleSkip} className="cursor-pointer">
          <Typography variant="body-2" weight="regular" className="text-neutral-50 text-center whitespace-nowrap">
            나중에 할래요
          </Typography>
        </button>
      </div>

      {/* Add Button */}
      <div className="absolute bottom-[41px] left-1/2 transform -translate-x-1/2 w-[320px]">
        <BaseButton variant="primary" size="medium" text="추가할래요" fullWidth onClick={handleAddMore} />
      </div>
    </MobileLayout>
  );
};

export default BankAdditionalConnectionPage;
