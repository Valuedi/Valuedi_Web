import { useState, useEffect } from 'react'; // 💡 추가
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { PeerCompareSection } from './components/PeerCompareSection';
import { CategoryCompareSection } from './components/CategoryCompareSection';
import { HistoryCompareSection } from './components/HistoryCompareSection';

export const CompareAnalysis = () => {
  // 💡 1. 로딩 상태 선언 (기본값 true)
  const [isLoading, setIsLoading] = useState(true);

  // 💡 2. 페이지 진입 시 0.8초 딜레이
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileLayout className="bg-neutral-0 shadow-none">
      <div className="flex flex-col min-h-screen bg-neutral-0">
        {/* 1. 또래별 비교 섹션 */}
        <PeerCompareSection isLoading={isLoading} />

        <div className="h-2 bg-neutral-5" />

        {/* 2. 카테고리별 비교 섹션 */}
        <CategoryCompareSection isLoading={isLoading} />

        <div className="h-2 bg-neutral-5" />
        {/* 3. 소비내역 비교 섹션 */}
        <HistoryCompareSection isLoading={isLoading} />
      </div>
    </MobileLayout>
  );
};
