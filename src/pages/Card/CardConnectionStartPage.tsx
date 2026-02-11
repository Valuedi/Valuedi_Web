import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import CardGNB from '@/shared/components/card/CardGNB';
import { Typography } from '@/shared/components/typography';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import { useUserName } from '@/shared/hooks/useUserName';
import BankInfiniteGrid from '@/shared/components/bank/BankInfiniteGrid';
import { CARDS } from '@/features/card/constants/cards';
import { cn } from '@/shared/utils/cn';
import { assetApi } from '@/features/asset';
import BankInfoModal from '@/shared/components/bank/BankInfoModal';

const CardConnectionStartPage = () => {
  const navigate = useNavigate();
  const userName = useUserName();
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    // 사용자가 이미 연동한 카드가 있는지 확인
    const checkConnection = async () => {
      try {
        const response = await assetApi.getCardIssuers();
        if (response.isSuccess && response.result && response.result.length > 0) {
          setIsFirstLogin(false);
        }
      } catch (error) {
        console.error('카드 연동 상태 확인 실패:', error);
      }
    };

    checkConnection();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    // MBTI 페이지로 이동
    navigate('/mbti');
  };

  const handleStartClick = () => {
    setIsInfoModalOpen(true);
  };

  const handleInfoConfirm = () => {
    setIsInfoModalOpen(false);
    // 바로 카드 선택 페이지로 이동
    navigate('/card/select');
  };

  return (
    <MobileLayout>
      <div className="w-full bg-white">
        <CardGNB onBack={handleBack} />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center w-[320px] mx-auto mt-[20px]">
        <div className="flex items-center w-full">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90 tracking-[-0.36px]">
            <p className="mb-0">{userName}님의 카드를</p>
            <p>연결할게요</p>
          </Typography>
        </div>
      </div>

      {/* 카드사 무한 스크롤 그리드 */}
      <BankInfiniteGrid availableBanks={CARDS} />

      {/* 하단 버튼 영역 */}
      <div className="absolute bottom-[41px] left-1/2 transform -translate-x-1/2 w-[320px] flex flex-col items-center">
        {isFirstLogin && (
          <button type="button" className={cn('cursor-pointer px-[10px] py-[8px]')} onClick={handleSkip}>
            <Typography style="text-body-2-14-regular" className="text-neutral-50">
              다음에 할게요
            </Typography>
          </button>
        )}

        <BaseButton variant="primary" size="medium" text="시작하기" fullWidth onClick={handleStartClick} />
      </div>

      <BankInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} onConfirm={handleInfoConfirm} />
    </MobileLayout>
  );
};

export default CardConnectionStartPage;
