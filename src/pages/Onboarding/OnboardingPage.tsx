import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStep } from './components/OnboardingStep';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { FirstStepImage } from './components/FristStepImage';
import { SecondStepImage } from './components/SecondStepImage';
import { ThirdStepImage } from './components/ThirdStepImage';
import { FourthStepImage } from './components/FourthStepImage';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const onboardingSteps = [
    {
      step: 1,
      title: '목표부터 세우면,\n돈의 방향이 보입니다',
      description: '저축 기간과 금액만 정하면 자동 계산',
      visual: <FirstStepImage />,
    },
    {
      step: 2,
      title: '금융 내역을 연결하면\n자동으로 분석해드려요',
      description: '가계부부터 카테고리 분석, 목표 대비까지',
      visual: <SecondStepImage />,
    },
    {
      step: 3,
      title: '나에게 맞는\n금융 선택만 남겨드립니다',
      description: '내 목표와 소비 패턴에 맞춘 상품, 전략 추천!',
      visual: <ThirdStepImage />,
    },
    {
      step: 4,
      title: '금융이 쉬워지는 흐름\n밸류디',
      description: '지금 시작해보세요',
      visual: <FourthStepImage />,
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
    }
  };

  const currentStepData = onboardingSteps[currentStep - 1];

  return (
    <MobileLayout className="bg-white p-0 overflow-hidden">
      <OnboardingStep
        step={currentStepData.step}
        title={currentStepData.title}
        description={currentStepData.description}
        onNext={handleNext}
        visual={currentStepData.visual}
      />
    </MobileLayout>
  );
};

export default OnboardingPage;
