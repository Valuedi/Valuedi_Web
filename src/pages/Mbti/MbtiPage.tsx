import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { useMbtiActions, useMbtiStore } from '@/shared/hooks/Mbti/useMbtiStore';
import { MbtiIntro } from './components/MbtiIntro';
import { MbtiTest } from './components/MbtiTest';
import { MbtiLoading } from './components/MbtiLoading';
import { MbtiResult } from './components/MbtiResult';
import { MbtiDetail } from './components/MbtiDetail';

export const MbtiPage = () => {
  const { step, testStep } = useMbtiStore();
  const { setTestStep, setStep, reset } = useMbtiActions();

  const handleBack = () => {
    if (step === 'test') {
      if (testStep > 0) setTestStep(testStep - 1);
      else setStep('intro');
    } else if (step === 'result') {
      reset();
    } else if (step === 'detail') {
      setStep('result');
    }
  };

  const getGnbConfig = () => {
    switch (step) {
      case 'intro':
        return { title: '', text: '' };
      case 'test':
        return { title: '', text: '', onBack: handleBack };
      case 'loading':
        return { title: '', text: '' };
      case 'result':
        return { title: '', text: '', onBack: reset };
      case 'detail':
        return { title: '', text: '', onBack: handleBack };
      default:
        return null;
    }
  };

  const gnbConfig = getGnbConfig();

  return (
    <MobileLayout>
      {gnbConfig && (
        <BackPageGNB title={gnbConfig.title} text={gnbConfig.text} onBack={gnbConfig.onBack} className="bg-neutral-0" />
      )}
      {step === 'intro' && <MbtiIntro />}
      {step === 'test' && <MbtiTest />}
      {step === 'loading' && <MbtiLoading />}
      {step === 'result' && <MbtiResult />}
      {step === 'detail' && <MbtiDetail />}
    </MobileLayout>
  );
};
