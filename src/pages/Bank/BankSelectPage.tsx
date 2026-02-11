import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BankGNB from '@/shared/components/bank/BankGNB';
import { Typography } from '@/shared/components/typography';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import BankCard from '@/shared/components/bank/BankCard';
import { BANKS } from '@/features/bank/constants/banks';
import { useUserName } from '@/shared/hooks/useUserName';

const BankSelectPage = () => {
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const userName = useUserName();

  const handleBack = () => {
    navigate(-1);
  };

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
  };

  const handleConnect = () => {
    if (selectedBank) {
      // 은행 아이디 입력 페이지로 이동
      navigate(`/bank/input-id?bank=${selectedBank}`);
    }
  };

  return (
    <MobileLayout>
      <div className="w-full bg-white">
        <BankGNB onBack={handleBack} />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center justify-center w-[320px] mx-auto mt-[20px]">
        <div className="flex items-center w-full">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90 tracking-[-0.36px]">
            <p className="mb-0">{userName}님의 은행을</p>
            <p>선택해주세요</p>
          </Typography>
        </div>
      </div>

      {/* Bank Grid */}
      <div className="flex flex-col gap-[12px] items-start w-[320px] mx-auto mt-[48px]">
        {[0, 1, 2, 3, 4].map((rowIndex) => (
          <div key={rowIndex} className="flex gap-[12px] items-center w-full">
            {BANKS.slice(rowIndex * 4, (rowIndex + 1) * 4).map((bank) => (
              <BankCard
                key={bank.id}
                bankName={bank.name}
                bankIcon={bank.icon}
                isSelected={selectedBank === bank.id}
                onClick={() => handleBankSelect(bank.id)}
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
          disabled={!selectedBank}
          className={!selectedBank ? 'bg-primary-light text-neutral-50' : ''}
        />
      </div>
    </MobileLayout>
  );
};

export default BankSelectPage;
