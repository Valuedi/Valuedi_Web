import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { BottomNavigation } from '@/shared/components/gnb/BottomNavigation';
import { SidebarNavigation } from '@/shared/components/gnb/SidebarNavigation';
import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { RecommendListItem } from './components/RecommendListItem';
import { HomeGNB } from '@/shared/components/gnb/HomeGNB';
import { RecommendBannerCard } from './components/RecommendBannerCard';
import { CategoryButton } from '@/shared/components/buttons';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';
import CheckDownIcon from '@/assets/icons/CheckDown.svg?react';
import {
  useSavingsRecommendations,
  useCreateSavingsRecommendations,
  useTop3Recommendations,
} from '@/features/recommend/recommend.hooks';
import { getBankIdByName } from '@/features/recommend/constants/bankMapper';

export type ProductType = 'all' | 'free' | 'fixed';

export const categoryList = [
  { type: 'all' as ProductType, label: '전체' },
  { type: 'free' as ProductType, label: '자유적금' },
  { type: 'fixed' as ProductType, label: '정기적금' },
] as const;

export const RecommendPage = () => {
  const POLLING_TIMEOUT_MS = 30000;
  const navigate = useNavigate();

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

  const [filter, setFilter] = useState<ProductType>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPolling, setIsPolling] = useState(false); // 폴링 상태 관리
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null); // 폴링 시작 시간
  const [refetchInterval, setRefetchInterval] = useState<number | undefined>(undefined); // 폴링 간격
  const hasAutoTriggeredRef = useRef(false);

  // 필터에 따라 rsrvType 결정: 'free' -> 'F', 'fixed' -> 'S', 'all' -> undefined
  const rsrvType = useMemo(() => {
    if (filter === 'free') return 'F' as const;
    if (filter === 'fixed') return 'S' as const;
    return undefined;
  }, [filter]);

  // 훅 호출
  const {
    data: recommendationsData,
    isLoading,
    isError,
    refetch,
  } = useSavingsRecommendations(rsrvType, refetchInterval);
  const createRecommendationsMutation = useCreateSavingsRecommendations();

  // API 응답에서 products 추출
  const products = recommendationsData?.products || [];
  // 빈 결과인지 확인 (status가 SUCCESS이고 products가 빈 배열인 경우)
  const isEmptyResult = !isLoading && !isError && recommendationsData?.status === 'SUCCESS' && products.length === 0;

  // Top3 추천 데이터 호출
  const { data: topData } = useTop3Recommendations();

  const top3Products = useMemo(() => {
    const items = topData?.products || [];
    return Array.from(new Map(items.map((item) => [item.finPrdtCd, item])).values());
  }, [topData?.products]);

  // 추천 생성 성공 시 폴링 시작, 실패 시 폴링 중지
  useEffect(() => {
    if (createRecommendationsMutation.isSuccess) {
      setIsPolling(true);
      setPollingStartTime(Date.now());
      setRefetchInterval(2000); // 2초마다 폴링 시작
      // 폴링을 위해 refetch 시작
      refetch();
    } else if (createRecommendationsMutation.isError) {
      setIsPolling(false);
      setPollingStartTime(null);
      setRefetchInterval(undefined);
    }
  }, [createRecommendationsMutation.isSuccess, createRecommendationsMutation.isError, refetch]);

  // 추천 페이지 첫 진입 시 기존 추천이 없다면 자동으로 추천 생성 트리거
  useEffect(() => {
    const shouldAutoCreate =
      filter === 'all' &&
      !hasAutoTriggeredRef.current &&
      !isLoading &&
      !isError &&
      recommendationsData?.status === 'SUCCESS' &&
      products.length === 0 &&
      !isPolling &&
      !createRecommendationsMutation.isPending;

    if (!shouldAutoCreate) return;

    hasAutoTriggeredRef.current = true;
    createRecommendationsMutation.mutate();
  }, [
    filter,
    isLoading,
    isError,
    recommendationsData?.status,
    products.length,
    isPolling,
    createRecommendationsMutation,
  ]);

  // 결과가 나오면 폴링 중지
  useEffect(() => {
    if (isPolling && products.length > 0) {
      setIsPolling(false);
      setPollingStartTime(null);
      setRefetchInterval(undefined);
    }
  }, [isPolling, products.length]);

  // 타임아웃 시 폴링 중지
  useEffect(() => {
    if (pollingStartTime === null) return;

    const timeoutId = setTimeout(() => {
      setIsPolling(false);
      setPollingStartTime(null);
      setRefetchInterval(undefined);
    }, POLLING_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [pollingStartTime, POLLING_TIMEOUT_MS]);

  // 필터링 및 중복 제거 (API에서 이미 필터링되지만, 혹시 몰라서 클라이언트에서도 필터링)
  const filteredList = useMemo(() => {
    // 먼저 중복 제거 (finPrdtCd 기준)
    const uniqueProducts = Array.from(new Map(products.map((item) => [item.finPrdtCd, item])).values());

    // 필터 적용
    if (filter === 'all') return uniqueProducts;
    return uniqueProducts.filter((item) => {
      if (filter === 'free') return item.rsrvType === 'F';
      if (filter === 'fixed') return item.rsrvType === 'S';
      return true;
    });
  }, [products, filter]);

  return (
    <MobileLayout className="bg-neutral-0">
      {/* 데스크탑 레이아웃: 사이드바 + 메인 콘텐츠 */}
      <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
        {/* 데스크탑 사이드바 (모바일에서는 숨김) */}
        <div className="hidden md:block">
          <SidebarNavigation activeItem="recommend" onItemClick={handleNavClick} />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col w-full min-h-screen md:min-h-0">
          {/* GNB */}
          <div className="sticky top-0 z-10 w-full">
            <HomeGNB title="추천" />
          </div>

          {/* Content */}
          <div className="flex-1 pb-[80px] md:pb-0 w-full">
            <div className="flex flex-col gap-[32px] px-[20px] md:px-[32px] lg:px-[40px] py-[20px] md:py-[32px]">
              {/* 배너 영역 - 모바일에서 가로 스와이프, 스크롤바는 숨김 */}
              <div
                className={cn(
                  'flex gap-[12px] overflow-x-auto pb-2 scrollbar-none',
                  'md:grid md:grid-cols-2 md:overflow-x-visible md:gap-[20px]',
                  'lg:gap-[24px]'
                )}
              >
                {top3Products.map((product, index) => (
                  <RecommendBannerCard
                    key={`${product.finPrdtCd}-${index}`}
                    title={product.finPrdtNm}
                    subTitle={product.korCoNm}
                    bankId={getBankIdByName(product.korCoNm)}
                    onClick={() => navigate(`/recommend/detail/${product.finPrdtCd}`)}
                  />
                ))}
              </div>

              {/* 필터 및 리스트 영역 */}
              <div className={cn('flex flex-col gap-[12px] w-full md:max-w-none')}>
                {/* 카테고리 필터 - 모바일에서 가로 스크롤 가능 */}
                <div className={cn('flex gap-[8px] overflow-x-auto py-[4px] scrollbar-none')}>
                  {categoryList.map((category) => (
                    <CategoryButton
                      key={category.type}
                      text={category.label}
                      isSelected={filter === category.type}
                      onClick={() => {
                        setFilter(category.type);
                        setIsExpanded(false);
                      }}
                    />
                  ))}
                </div>

                {/* 리스트 및 상태 영역 */}
                <div className={cn('flex flex-col gap-[12px]')}>
                  {(isLoading || isPolling) && (
                    <div className="flex flex-col gap-[8px] py-[20px]">
                      {isPolling ? (
                        <>
                          <div className="rounded-[12px] border border-primary-20 bg-primary-5 px-[16px] py-[14px]">
                            <Typography style="text-body-2-14-semi-bold" className="text-primary-normal text-center">
                              AI가 회원님께 맞는 적금을 고르고 있어요
                            </Typography>
                            <Typography
                              style="text-caption-1-12-regular"
                              className="text-neutral-60 text-center mt-[4px]"
                            >
                              결과를 찾는 중이니 잠시만 기다려 주세요
                            </Typography>
                          </div>

                          <div className="flex flex-col gap-[8px] mt-[4px]">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={`recommend-skeleton-${index}`}
                                className="rounded-[10px] border border-neutral-20 p-[14px]"
                              >
                                <Skeleton className="w-[72px] h-[14px] rounded mb-[10px]" />
                                <Skeleton className="w-[70%] h-[18px] rounded mb-[8px]" />
                                <Skeleton className="w-[50%] h-[14px] rounded" />
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Typography style="text-body-2-14-regular" className="text-neutral-70 text-center">
                          추천 상품을 불러오는 중...
                        </Typography>
                      )}
                    </div>
                  )}
                  {isError && (
                    <div className="flex flex-col gap-[8px] py-[20px]">
                      <Typography style="text-body-2-14-regular" className="text-neutral-70 text-center">
                        추천 상품을 불러오는데 실패했습니다.
                      </Typography>
                      <button
                        onClick={() => createRecommendationsMutation.mutate()}
                        disabled={createRecommendationsMutation.isPending}
                        className={cn(
                          'px-[16px] py-[8px] bg-primary-60 text-white rounded-[4px] text-body-2-14-semi-bold',
                          createRecommendationsMutation.isPending && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {createRecommendationsMutation.isPending ? '추천 생성 중...' : '새로 추천 받기'}
                      </button>
                    </div>
                  )}
                  {isEmptyResult && (
                    <div className="flex flex-col gap-[8px] py-[20px]">
                      <button
                        onClick={() => createRecommendationsMutation.mutate()}
                        disabled={createRecommendationsMutation.isPending}
                        className={cn(
                          'px-[16px] py-[8px] bg-primary-60 text-white rounded-[4px] text-body-2-14-semi-bold',
                          createRecommendationsMutation.isPending && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {createRecommendationsMutation.isPending ? '추천 생성 중...' : '추천 상품 받기'}
                      </button>
                    </div>
                  )}
                  {!isLoading && !isError && !isEmptyResult && filteredList.length === 0 && (
                    <div className="flex flex-col gap-[8px] py-[20px]">
                      <button
                        onClick={() => createRecommendationsMutation.mutate()}
                        disabled={createRecommendationsMutation.isPending}
                        className={cn(
                          'px-[16px] py-[8px] bg-primary-60 text-white rounded-[4px] text-body-2-14-semi-bold',
                          createRecommendationsMutation.isPending && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {createRecommendationsMutation.isPending ? '추천 생성 중...' : '추천 상품 받기'}
                      </button>
                    </div>
                  )}
                  {!isLoading && !isError && filteredList.length > 0 && (
                    <>
                      <div
                        className={cn('flex flex-col gap-[4px] md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-[12px]')}
                      >
                        {(isExpanded ? filteredList : filteredList.slice(0, 6)).map((product, index) => (
                          <RecommendListItem
                            key={`${product.finPrdtCd}-${index}`}
                            bankName={product.korCoNm}
                            productName={product.finPrdtNm}
                            description={`${product.rsrvTypeNm} | ${product.korCoNm}`}
                            onClick={() => navigate(`/recommend/detail/${product.finPrdtCd}`)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {!isLoading && !isError && filteredList.length > 6 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className={cn(
                        'flex items-center justify-center gap-[8px] border border-neutral-10 rounded-[4px] p-[8px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)] cursor-pointer'
                      )}
                    >
                      <Typography style="text-body-2-14-regular" className="text-neutral-70 text-center">
                        {isExpanded ? '목록 접기' : '목록 더 보기'}
                      </Typography>
                      <CheckDownIcon className={cn('text-neutral-70', isExpanded && 'rotate-180')} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation - 모바일 전용 */}
          <div className="fixed bottom-0 left-0 w-full z-20 md:hidden">
            <BottomNavigation activeItem="recommend" onItemClick={handleNavClick} />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RecommendPage;
