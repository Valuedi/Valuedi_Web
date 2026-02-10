import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Typography } from '@/components';
import { cn } from '@/utils/cn';
import BackPageGNB from '@/components/gnb/BackPageGNB';
import ProfileIcon from '@/assets/icons/mbti/Profile.svg';
import MyMbti from './components/MyMbti';
import { SegmentedButton } from '@/components/buttons/SegmentedButton';
import { useGetProfile } from '@/hooks/MyPage/useGetProfile';
import MyTrophy from './components/MyTrophy';

type TabType = 'mbti' | 'trophy';

export const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, mbtiResult } = useGetProfile();
  const [activeTab, setActiveTab] = useState<'mbti' | 'trophy'>('mbti');

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const tabOptions = [
    { label: '금융 MBTI', value: 'mbti' as const },
    { label: '트로피', value: 'trophy' as const },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MobileLayout className={cn('bg-neutral-0')}>
      <div className={cn('sticky top-0 z-10 w-full')}>
        <BackPageGNB
          className={cn('bg-neutral-0')}
          onBack={handleBack}
          text=""
          title="내정보"
          titleColor="text-neutral-90"
        />
      </div>

      <div className={cn('flex flex-col px-[20px] pb-[20px] gap-[20px]')}>
        <div className={cn('flex justify-between py-[8px] items-center mt-[20px]')}>
          <div className={cn('flex gap-[4px]')}>
            <div className={cn('flex')}>
              <img src={ProfileIcon} />
            </div>
            <div>
              <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
                {mbtiResult?.title}
              </Typography>
              <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                {userName}님
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('sticky z-10 w-full px-[20px] top-[50px] pb-[20px]')}>
        <SegmentedButton<TabType> value={activeTab} onChange={setActiveTab} options={tabOptions} />
      </div>

      <div className={cn('flex-1 px-[20px]')}>
        {activeTab === 'mbti' && <MyMbti />}
        {activeTab === 'trophy' && <MyTrophy />}
      </div>
    </MobileLayout>
  );
};

export default MyPage;
