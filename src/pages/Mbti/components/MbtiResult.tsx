import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components';
import { cn } from '@/utils/cn';
import MbtiCard from '@/components/mbti/MbtiCard';
import { LoginButton } from '@/components/buttons';
import { useMbtiActions } from '@/hooks/Mbti/useMbtiStore';
import { useGetMbtiTestResult } from '@/hooks/Mbti/useGetMbtiTestResult';

export const MbtiResult = () => {
  const navigate = useNavigate();
  const { setStep } = useMbtiActions();

  const { data: result, isFetching } = useGetMbtiTestResult();

  const handleDetail = () => {
    setStep('detail');
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className={cn('flex flex-col h-full min-h-screen bg-neutral-0 overflow-y-auto')}>
      <div className={cn('flex-1 flex flex-col px-[20px] pb-[40px]')}>
        {isFetching || !result ? (
          <div className={cn('flex items-center justify-center')}>
            <div className="mt-[20px] w-[272px] h-[272px] bg-neutral-10 rounded-[8px]" />
          </div>
        ) : (
          <MbtiCard
            mbtiType={result?.title}
            subDetail={result?.tagline}
            description={result?.extraDescription}
            icon={result?.icon}
            className="mt-[20px]"
          />
        )}

        <div className={cn('flex flex-col mt-[49px]')}>
          <button type="button" onClick={handleDetail} className={cn('cursor-pointer px-[10px] py-[8px]')}>
            <Typography style="text-body-2-14-regular" className={cn('text-neutral-50')}>
              자세히 보고싶어요
            </Typography>
          </button>

          <LoginButton text="홈으로" onClick={handleHome} />
        </div>
      </div>
    </div>
  );
};
