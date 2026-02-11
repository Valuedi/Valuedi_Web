import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import CardGNB from '@/shared/components/card/CardGNB';
import { Typography } from '@/shared/components/typography';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import { useUserName } from '@/shared/hooks/useUserName';
import BankInfiniteGrid from '@/shared/components/bank/BankInfiniteGrid';
import { CARDS } from '@/features/card/constants/cards';

const CardConnectionStartPage = () => {
  const navigate = useNavigate();
  const userName = useUserName();

  const handleBack = () => {
    navigate(-1);
  };

  const handleStart = () => {
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
    </MobileLayout>
  );
};

export default CardConnectionStartPage;
