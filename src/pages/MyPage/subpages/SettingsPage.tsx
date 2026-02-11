import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { MoreViewButton } from '@/shared/components/buttons/MoreViewButton';
import { Toast } from '@/shared/components/common/Toast';
import { useEffect, useState } from 'react';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleDevelopingClick = () => {
    setShowToast(true); // 💡 "개발중이에요" 알림 띄우기
  };

  return (
    <MobileLayout className="bg-white">
      {/* GNB */}
      <BackPageGNB
        title="설정"
        onBack={() => navigate(-1)}
        className="bg-white border-b border-neutral-5"
        titleColor="text-neutral-90"
        text=""
      />

      <div className="flex-1 overflow-y-auto">
        {/* 1. 금융 정보 */}
        <SettingsSection title="금융 정보">
          <SettingsItem
            label="연결된 은행"
            onClick={() => navigate('/mypage/connection', { state: { target: 'bank' } })}
          />
          <SettingsItem
            label="연결된 카드"
            onClick={() => navigate('/mypage/connection', { state: { target: 'card' } })}
          />
        </SettingsSection>

        <SectionDivider />

        {/* 2. 회원 정보 */}
        <SettingsSection title="회원 정보">
          <SettingsItem label="MBTI 검사하기" onClick={() => navigate('/mbti')} />
          <SettingsItem label="회원정보 변경" onClick={handleDevelopingClick} />
          <SettingsItem label="비밀번호 재설정" onClick={handleDevelopingClick} />
          <SettingsItem label="약관 및 마케팅 동의 관리" onClick={() => navigate('/mypage/settings/terms')} />
        </SettingsSection>

        <SectionDivider />

        {/* 3. 서비스 정보 */}
        <SettingsSection title="서비스 정보">
          <SettingsItem label="공지사항" onClick={() => {}} />
          <SettingsItem label="1:1 문의 안내" onClick={() => {}} />
          <SettingsItem label="버전 안내" onClick={() => {}} />
          <SettingsItem label="로그아웃" isDanger onClick={() => navigate('/logout')} />
          <SettingsItem label="밸류디 탈퇴하기" isDanger onClick={() => navigate('/withdraw')} />
        </SettingsSection>
      </div>
      <Toast message="개발중이에요" isOpen={showToast} />
    </MobileLayout>
  );
};

/**
 * 💡 섹션 컴포넌트: 타이틀과 리스트를 감싸는 역할
 */
const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col">
    <div className="px-5 pt-7 pb-2">
      <Typography variant="body-1" weight="semi-bold" className="text-neutral-90">
        {title}
      </Typography>
    </div>
    <div className="flex flex-col pb-2 text-neutral-90">{children}</div>
  </div>
);

/**
 * 💡 아이템 컴포넌트: 각 줄(Row)을 담당
 */
const SettingsItem = ({
  label,
  onClick,
  isDanger = false,
}: {
  label: string;
  onClick?: () => void;
  isDanger?: boolean;
}) => (
  <div
    onClick={onClick}
    className="w-full px-5 py-4 flex items-center justify-between active:bg-neutral-3 transition-colors cursor-pointer"
  >
    <Typography variant="body-2" className={cn(isDanger ? 'text-red-500 font-medium' : 'text-neutral-70')}>
      {label}
    </Typography>
    <MoreViewButton className="opacity-50 pointer-events-none" />
  </div>
);

/**
 * 💡 섹션 구분선: 이미지에 있는 두꺼운 회색 바
 */
const SectionDivider = () => <div className="h-2 bg-neutral-10 w-full" />;
