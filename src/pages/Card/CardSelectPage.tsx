import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import CardGNB from '@/shared/components/card/CardGNB';
import { Typography } from '@/shared/components/typography';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import CardCard from '@/shared/components/card/CardCard';
import { CARDS } from '@/features/card/constants/cards';
import { useUserName } from '@/shared/hooks/useUserName';

const CardSelectPage = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const userName = useUserName();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handleConnect = () => {
    if (selectedCard) {
      // 카드사 아이디 입력 페이지로 이동
      navigate(`/card/input-id?card=${selectedCard}`);
    }
  };

  return (
    <MobileLayout>
      <div className="w-full bg-white">
        <CardGNB onBack={handleBack} />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center justify-center w-[320px] mx-auto mt-[20px]">
        <div className="flex items-center w-full">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90 tracking-[-0.36px]">
            <p className="mb-0">{userName}님의 카드를</p>
            <p>선택해주세요</p>
          </Typography>
        </div>
      </div>

      {/* Card Grid */}
      <div className="flex flex-col gap-[12px] items-start w-[320px] mx-auto mt-[48px]">
        {[0, 1, 2, 3, 4].map((rowIndex) => (
          <div key={rowIndex} className="flex gap-[12px] items-center w-full">
            {CARDS.slice(rowIndex * 4, (rowIndex + 1) * 4).map((card) => (
              <CardCard
                key={card.id}
                cardName={card.name}
                cardIcon={card.icon}
                isSelected={selectedCard === card.id}
                onClick={() => handleCardSelect(card.id)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="absolute bottom-[41px] left-1/2 transform -translate-x-1/2 w-[320px]">
        <BaseButton
          variant="primary"
          size="medium"
          text="연결하기"
          fullWidth
          onClick={handleConnect}
          disabled={!selectedCard}
          className={!selectedCard ? 'bg-primary-light text-neutral-50' : ''}
        />
      </div>
    </MobileLayout>
  );
};

export default CardSelectPage;
