import { useState, useEffect } from 'react'; // 💡 추가
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
    // AssetPage 에서 이미 MobileLayout 을 감싸고 있으므로, 여기서는 순수 섹션만 렌더링
    <div className="flex flex-col min-h-full bg-neutral-0">
      {/* 1. 또래별 비교 섹션 */}
      <PeerCompareSection isLoading={isLoading} />

      <div className="h-2 bg-neutral-5" />

      {/* 2. 카테고리별 비교 섹션 */}
      <CategoryCompareSection isLoading={isLoading} />

      <div className="h-2 bg-neutral-5" />
      {/* 3. 소비내역 비교 섹션 */}
      <HistoryCompareSection isLoading={isLoading} />
    </div>
  );
};
