import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BankGNB from '@/shared/components/bank/BankGNB';
import { Typography } from '@/shared/components/typography';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import AuthInput from '@/shared/components/login/AuthInput';
import { useUserName } from '@/shared/hooks/useUserName';

const BankIdInputPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bankId = searchParams.get('bank');
  const [userId, setUserId] = useState('');
  const userName = useUserName();

  const handleBack = () => {
    navigate(-1);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleNext = () => {
    if (userId.trim()) {
      // 은행 비밀번호 입력 페이지로 이동 (userId를 state로 전달)
      navigate(`/bank/input-password?bank=${bankId}`, {
        state: { loginId: userId },
      });
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
            <p className="mb-0">{userName}님의 은행 아이디를</p>
            <p>알려주세요</p>
          </Typography>
        </div>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-[8px] items-start w-[320px] mx-auto mt-[48px]">
        <AuthInput
          label="은행사 아이디"
          placeholder="해당 은행의 아이디를 입력해주세요."
          type="text"
          name="bankUserId"
          value={userId}
          onChange={handleUserIdChange}
          width="full"
        />
      </div>

      {/* Button */}
      <div className="absolute bottom-[41px] left-1/2 transform -translate-x-1/2 w-[320px]">
        <BaseButton
          variant="primary"
          size="medium"
          text="다음으로"
          fullWidth
          onClick={handleNext}
          disabled={!userId.trim()}
        />
      </div>
    </MobileLayout>
  );
};

export default BankIdInputPage;
