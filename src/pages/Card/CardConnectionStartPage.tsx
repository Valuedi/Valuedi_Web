import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import CardGNB from '@/components/card/CardGNB';
import { Typography } from '@/components/typography';
import { BaseButton } from '@/components/buttons/BaseButton';
import BankInfoModal from '@/components/bank/BankInfoModal';
import { useUserName } from '@/hooks/useUserName';
import BankInfiniteGrid from '@/components/bank/BankInfiniteGrid';
import { CARDS } from '@/features/card/constants/cards';

const CardConnectionStartPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const userName = useUserName();

  const handleBack = () => {
    navigate(-1);
  };

  const handleStart = () => {
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    // 다음 페이지로 이동 (카드 선택 페이지)
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

      {/* Bank Infinite Grid */}
      <BankInfiniteGrid availableBanks={CARDS} />

      {/* Button */}
      <div className="absolute bottom-[41px] left-1/2 transform -translate-x-1/2 w-[320px]">
        <BaseButton variant="primary" size="medium" text="시작하기" fullWidth onClick={handleStart} />
      </div>

      {/* Info Modal */}
      <BankInfoModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleModalConfirm} />
    </MobileLayout>
  );
};

export default CardConnectionStartPage;
