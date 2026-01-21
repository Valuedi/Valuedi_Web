import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { HomeGNB } from '@/components/gnb/HomeGNB';
import { BottomNavigation } from '@/components/gnb/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components';
import { cn } from '@/utils/cn';

import { AssetDetails } from './tab/AssetDetails/AssetDetailsPage';

export const AssetPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'details' | 'sector' | 'compare'>('details');

  const handleNavClick = (item: 'home' | 'asset' | 'recommend' | 'goal') => {
    switch (item) {
      case 'home':
        navigate('/home');
        break;
      case 'asset':
        navigate('/asset');
        break;
      case 'recommend':
        navigate('/recommend');
        break;
      case 'goal':
        navigate('/goal');
        break;
    }
  };

  return (
    <MobileLayout className="bg-neutral-0">
      <div className="sticky top-0 z-10 w-full">
        <HomeGNB />
      </div>

      <div className="flex w-full px-[20px] border-b border-neutral-30 z-20">
        <button
          onClick={() => setActiveTab('details')}
          className={cn('flex-1 px-[12px] py-[6px] ', activeTab === 'details' && 'border-b border-neutral-90')}
        >
          <Typography
            style="text-body-2-14-medium"
            className={`${activeTab === 'details' ? 'text-neutral-90' : 'text-neutral-70'}`}
            fontFamily="pretendard"
          >
            자산 내역
          </Typography>
        </button>

        <button
          onClick={() => setActiveTab('sector')}
          className={cn('flex-1 px-[12px] py-[6px] ', activeTab === 'sector' && 'border-b border-neutral-90')}
        >
          <Typography
            style="text-body-2-14-medium"
            className={`${activeTab === 'sector' ? 'text-neutral-90' : 'text-neutral-70'}`}
            fontFamily="pretendard"
          >
            분야별 내역
          </Typography>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={cn('flex-1 px-[12px] py-[6px] ', activeTab === 'compare' && 'border-b border-neutral-90')}
        >
          <Typography
            style="text-body-2-14-medium"
            className={`${activeTab === 'compare' ? 'text-neutral-90' : 'text-neutral-70'}`}
            fontFamily="pretendard"
          >
            비교 내역
          </Typography>
        </button>
      </div>

      <div className="flex-1 pb-[80px] overflow-y-auto">{activeTab === 'details' && <AssetDetails />}</div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[360px]">
        <BottomNavigation activeItem="asset" onItemClick={handleNavClick} />
      </div>
    </MobileLayout>
  );
};

export default AssetPage;
