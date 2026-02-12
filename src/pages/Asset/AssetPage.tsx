import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { HomeGNB } from '@/shared/components/gnb/HomeGNB';
import { BottomNavigation } from '@/shared/components/gnb/BottomNavigation';
import { SidebarNavigation } from '@/shared/components/gnb/SidebarNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';

import { AssetDetails } from './tab/AssetDetails/AssetDetailsPage';
import { SectorAnalysis } from './tab/SectorAnalysis/SectorAnalysisPage';
import { CompareAnalysis } from './tab/CompareAnalysis/CompareAnalysisPage';

export const AssetPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeTab = pathname.includes('/sector') ? 'sector' : pathname.includes('/compare') ? 'compare' : 'details';

  const handleTabClick = (tab: 'details' | 'sector' | 'compare') => {
    if (tab === 'details') navigate('/asset');
    else navigate(`/asset/${tab}`);
  };

  const handleNavClick = (item: 'home' | 'asset' | 'recommend' | 'goal') => {
    navigate(`/${item}`);
  };

  return (
    <MobileLayout className="bg-neutral-0">
      {/* 데스크탑 레이아웃: 사이드바 + 메인 콘텐츠 */}
      <div className="flex flex-row min-h-screen md:h-screen">
        {/* 데스크탑 사이드바 */}
        <SidebarNavigation activeItem="asset" onItemClick={handleNavClick} />

        {/* 메인 콘텐츠 영역 (HomePage와 동일한 데스크탑 레이아웃 패턴) */}
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0 w-full overflow-x-hidden">
          <div className="sticky top-0 z-10 w-full">
            <HomeGNB />
          </div>

          <div className="flex w-full px-[20px] md:px-[32px] lg:px-[40px] border-b border-neutral-30 z-20">
            <button
              onClick={() => handleTabClick('details')}
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
              onClick={() => handleTabClick('sector')}
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
              onClick={() => handleTabClick('compare')}
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

          <div className="flex-1 pb-[80px] md:pb-0 overflow-y-auto">
            {activeTab === 'details' && <AssetDetails />}
            {activeTab === 'sector' && <SectorAnalysis />}
            {activeTab === 'compare' && <CompareAnalysis />}
          </div>

          {/* Bottom Navigation - 모바일 전용 */}
          <div className="fixed bottom-0 left-0 w-full md:hidden">
            <BottomNavigation activeItem="asset" onItemClick={handleNavClick} />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AssetPage;
