import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { Typography } from '@/shared/components/typography';
import { MoreViewButton } from '@/shared/components/buttons/MoreViewButton';

import SettingIcon from '@/assets/icons/menu/setting.svg';
import MBTIIcon from '@/assets/icons/menu/mbti.svg';
import TrophyIcon from '@/assets/icons/menu/trophy.svg';
import LedgerIcon from '@/assets/icons/menu/ledger.svg';
import ConnectionIcon from '@/assets/icons/menu/connection.svg';

import AssetIcon from '@/assets/icons/menu/asset.svg';
import GoalIcon from '@/assets/icons/menu/goal.svg';
import RecommendIcon from '@/assets/icons/menu/recommend.svg';

export const MenuGNB = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout className="bg-white">
      <div className="sticky top-0 z-10 w-full">
        <BackPageGNB
          title="전체"
          onBack={() => navigate(-1)}
          text={<img src={SettingIcon} alt="설정" className="w-[16px] h-[16px] md:w-[20px] md:h-[20px]" />}
          onSkip={() => navigate('/mypage/settings')}
          className="bg-white border-b border-neutral-5"
          titleColor="text-neutral-90"
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-10 md:pb-0">
        {/* 1. 상단 퀵 메뉴 그리드 */}
        <div className="grid grid-cols-4 gap-y-4 px-4 md:px-0 lg:px-0 py-6 md:py-8 lg:py-10 justify-items-center">
          <QuickMenuButton label="MBTI" icon={MBTIIcon} onClick={() => navigate('/mypage')} />
          <QuickMenuButton
            label="트로피"
            icon={TrophyIcon}
            onClick={() => navigate('/mypage', { state: { tab: 'trophy' } })}
          />
          <QuickMenuButton
            label="가계부"
            icon={LedgerIcon}
            onClick={() => navigate('/asset', { state: { tab: 'ledger' } })}
          />
          <QuickMenuButton label="연결관리" icon={ConnectionIcon} onClick={() => navigate('/mypage/connection')} />
        </div>

        {/* 💡 2. 리스트 섹션 영역 시작 */}
        <div className="flex flex-col md:grid md:grid-cols-3 md:gap-6 lg:gap-8 px-5 md:px-8 lg:px-10 pb-10 md:pb-12 lg:pb-16">
          {/* 자산 섹션 (위에 선 생김) */}
          <MenuSection title="자산" icon={AssetIcon}>
            <MenuItem label="나의 자산내역" onClick={() => navigate('/asset')} />
            <MenuItem label="분야별 내역" onClick={() => navigate('/asset/sector')} />
            <MenuItem label="또래별 비교분석" onClick={() => navigate('/asset/compare')} />
          </MenuSection>

          {/* 목표 섹션 (위에 선 생김) */}
          <MenuSection title="목표" icon={GoalIcon}>
            <MenuItem label="현재 목표" onClick={() => navigate('/goal/current')} />
            <MenuItem label="지난 목표" onClick={() => navigate('/goal/past')} />
            <MenuItem label="목표 새로 추가하기" />
          </MenuSection>

          {/* 추천 섹션 (위에 선 생김) */}
          <MenuSection title="추천" icon={RecommendIcon}>
            <MenuItem label="추천 적금 바로가기" onClick={() => navigate('/recommend')} />
          </MenuSection>
        </div>
      </div>
    </MobileLayout>
  );
};

/**
 * 💡 퀵 메뉴 버튼: 52x52 사이즈와 Neutrals/10 배경 적용
 */
const QuickMenuButton = ({ label, icon, onClick }: { label: string; icon?: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80 active:opacity-60"
  >
    <div className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px] bg-neutral-10 rounded-xl flex items-center justify-center">
      {icon ? (
        <img src={icon} alt={label} className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain" />
      ) : (
        <div className="w-6 h-6 bg-neutral-20 rounded" />
      )}
    </div>
    <Typography variant="caption-1" className="text-neutral-70 md:text-body-3-13-regular">
      {label}
    </Typography>
  </button>
);

/**
 * 💡 메뉴 섹션 (자산, 목표 등 그룹)
 */
const MenuSection = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) => (
  <div className="flex flex-col border-t md:border-t-0 md:border-l md:first:border-l-0 border-neutral-5 md:bg-white md:rounded-lg md:shadow-sm md:p-6 lg:p-8">
    <div className="px-5 md:px-0 pt-8 md:pt-0 pb-4 md:pb-6 flex items-center gap-2">
      <img src={icon} alt={title} className="w-5 h-5 md:w-6 md:h-6 object-contain" />
      <Typography variant="body-1" weight="bold" className="text-neutral-90 md:text-headline-3-18-semi-bold">
        {title}
      </Typography>
    </div>
    <div className="flex flex-col pb-4 md:pb-0">{children}</div>
  </div>
);

/**
 * 💡 MenuItem: div로 감싸서 중첩 버튼 에러 해결
 */
const MenuItem = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="w-full px-5 md:px-0 py-4 md:py-3 lg:py-4 flex items-center justify-between active:bg-neutral-3 md:hover:bg-neutral-5 md:rounded-md transition-colors text-left cursor-pointer"
  >
    <Typography variant="body-2" className="text-neutral-70 md:text-body-1-16-regular">
      {label}
    </Typography>
    <MoreViewButton className="opacity-50 pointer-events-none" />
  </div>
);
