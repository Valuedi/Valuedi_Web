import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { HomeGNB } from '@/shared/components/gnb/HomeGNB';
import { BottomNavigation } from '@/shared/components/gnb/BottomNavigation';
import { SidebarNavigation } from '@/shared/components/gnb/SidebarNavigation';
import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { MoreViewButton } from '@/shared/components/buttons/MoreViewButton';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import AddGoalIcon from '@/assets/icons/home/AddGoal.svg';
import kbIcon from '@/assets/icons/bank/kb.svg';
import SpendTodayIcon from '@/assets/icons/home/SpendToday.svg';
import SpendYesterdayIcon from '@/assets/icons/home/SpendYesterday.svg';
import MbtiHomeIcon from '@/assets/icons/home/MbtiHome.svg';
import { getAccountsApi, Account, getDailyTransactionsApi } from '@/features/asset/asset.api';
import { getTransactionSummaryApi } from '@/features/transaction/transaction.api';
import { getFinanceMbtiResultApi, getMbtiTypeDetails } from '@/features/mbti/mbti.api';
import { getTop3RecommendationsApi } from '@/features/recommend/recommend.api';
import { getGoalDetailApi } from '@/features/goal/goal.api';
import { ApiError } from '@/shared/api';
import { useGetMbtiTestResult } from '@/shared/hooks/Mbti/useGetMbtiTestResult';

// 목표 색상 배열
const GOAL_COLORS = ['#f5f0c8', '#c8d1f5', '#c8def5', '#d8f5c8', '#f5c8e8', '#c8f5e0'];

// 목표/계좌 아이콘 컴포넌트
const GoalAccountIcon = ({ bgColor }: { bgColor: string }) => (
  <div
    className={cn('w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded-[8px] flex items-center justify-center')}
    style={{ backgroundColor: bgColor, opacity: 0.65 }}
  >
    <img src={kbIcon} alt="은행 아이콘" className="w-[22px] h-[22px] md:w-[28px] md:h-[28px] object-contain" />
  </div>
);

export const HomePage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Array<{ id: string; name: string; amount: number; iconBg: string }>>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactionSummary, setTransactionSummary] = useState<{
    totalExpense: number;
    diffFromLastMonth: number;
  } | null>(null);
  const [mbtiResult, setMbtiResult] = useState<string>('');
  const [recommendedProducts, setRecommendedProducts] = useState<
    Array<{
      korCoNm: string;
      finPrdtNm: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalGoalCount, setTotalGoalCount] = useState(0);
  const [totalAccountCount, setTotalAccountCount] = useState(0);
  const [todayExpense, setTodayExpense] = useState(0);
  const [yesterdayExpense, setYesterdayExpense] = useState(0);

  // MBTI 결과 조회 (캐릭터 아이콘용)
  const { data: mbtiTestResult } = useGetMbtiTestResult();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 현재 년월 계산 (YYYY-MM 형식)
        const now = new Date();
        const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // 병렬로 모든 API 호출
        const [accountsRes, transactionRes, dailyTransactionsRes, mbtiRes, mbtiTypesRes, recommendRes] =
          await Promise.all([
            getAccountsApi(),
            getTransactionSummaryApi(yearMonth),
            getDailyTransactionsApi(yearMonth).catch(() => null), // 일별 거래 내역
            getFinanceMbtiResultApi().catch(() => null), // MBTI 결과가 없을 수 있음
            getMbtiTypeDetails().catch(() => null), // MBTI 타입 상세 정보
            getTop3RecommendationsApi().catch(() => null), // 추천 상품이 없을 수 있음
          ]);

        // 계좌 목록 처리
        if (accountsRes.result) {
          const accountList = accountsRes.result.accountList || [];
          setAccounts(accountList.slice(0, 3)); // 최대 3개만 표시
          setTotalAccountCount(accountsRes.result.totalCount || 0);

          // 계좌 목록에서 goalInfo가 있는 것들을 목표로 추출
          const goalAccounts = accountList.filter((acc) => acc.goalInfo !== null);
          const uniqueGoals = new Map<number, { goalId: number; title: string }>();

          goalAccounts.forEach((acc) => {
            if (acc.goalInfo) {
              uniqueGoals.set(acc.goalInfo.goalId, {
                goalId: acc.goalInfo.goalId,
                title: acc.goalInfo.title,
              });
            }
          });

          // 각 목표의 상세 정보 조회
          const goalDetailsPromises = Array.from(uniqueGoals.values())
            .slice(0, 3)
            .map(async (goal, index) => {
              try {
                const detailRes = await getGoalDetailApi(goal.goalId);
                if (detailRes.result) {
                  return {
                    id: String(goal.goalId),
                    name: detailRes.result.title,
                    amount: detailRes.result.savedAmount,
                    iconBg: GOAL_COLORS[index % GOAL_COLORS.length],
                  };
                }
              } catch (error) {
                // 목표 상세 조회 실패 시 기본 정보만 사용
                return {
                  id: String(goal.goalId),
                  name: goal.title,
                  amount: 0,
                  iconBg: GOAL_COLORS[index % GOAL_COLORS.length],
                };
              }
              return null;
            });

          const goalDetails = (await Promise.all(goalDetailsPromises)).filter(
            (goal): goal is { id: string; name: string; amount: number; iconBg: string } => goal !== null
          );
          setGoals(goalDetails);
          setTotalGoalCount(uniqueGoals.size);
        }

        // 거래 요약 처리
        if (transactionRes.result) {
          setTransactionSummary({
            totalExpense: transactionRes.result.totalExpense || 0,
            diffFromLastMonth: transactionRes.result.diffFromLastMonth || 0,
          });
        }

        // 오늘 및 어제 지출 내역 처리
        if (dailyTransactionsRes?.result) {
          const now = new Date();
          const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // YYYY-MM-DD

          const todayData = dailyTransactionsRes.result.find((item) => item.date === today);
          const yesterdayData = dailyTransactionsRes.result.find((item) => item.date === yesterday);

          setTodayExpense(todayData?.totalExpense || 0);
          setYesterdayExpense(yesterdayData?.totalExpense || 0);
        }

        // MBTI 결과 처리
        if (mbtiRes?.result && mbtiTypesRes?.result) {
          const resultType = mbtiRes.result.resultType;
          const mbtiTypeDetail = mbtiTypesRes.result.find((type) => type.type === resultType);
          if (mbtiTypeDetail) {
            setMbtiResult(mbtiTypeDetail.title);
          }
        }

        // 추천 상품 처리
        if (recommendRes?.result?.products) {
          setRecommendedProducts(
            recommendRes.result.products.slice(0, 3).map((product) => ({
              korCoNm: product.korCoNm,
              finPrdtNm: product.finPrdtNm,
            }))
          );
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        if (error instanceof ApiError && error.status === 401) {
          // 인증 오류는 api.ts에서 자동 처리됨
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <MobileLayout className="bg-neutral-10">
      {/* 데스크탑 레이아웃: 사이드바 + 메인 콘텐츠 */}
      <div className="flex flex-row min-h-screen md:h-screen">
        {/* 데스크탑 사이드바 */}
        <SidebarNavigation activeItem="home" onItemClick={handleNavClick} />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
          {/* GNB */}
          <div className="sticky top-0 z-10 w-full">
            <HomeGNB />
          </div>

          {/* Content */}
          <div className="flex-1 pb-[64px] md:pb-0 overflow-y-auto">
            <div className="flex flex-col gap-[8px] md:gap-[16px] px-[20px] md:px-[32px] lg:px-[40px] py-[16px] md:py-[24px]">
              {/* 목표 추가하기 카드 */}
              <button
                onClick={() => navigate('/goal/create')}
                className="w-full bg-white border border-neutral-10 rounded-[8px] p-[12px] md:p-[16px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)] text-left hover:shadow-[0px_4px_20px_0px_rgba(25,25,20,0.08)] transition-shadow"
              >
                <div className="flex gap-[8px] items-center">
                  <div className="size-8 md:size-10 flex items-center justify-center">
                    <img src={AddGoalIcon} alt="목표 추가" className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <Typography style="text-caption-2-11-regular" className="text-neutral-50" fontFamily="pretendard">
                      또 다른 목표가 있나요?
                    </Typography>
                    <Typography style="text-body-2-14-semi-bold" className="text-neutral-90" fontFamily="pretendard">
                      목표 추가하기
                    </Typography>
                  </div>
                </div>
              </button>

              {/* 목표와 계좌를 데스크탑에서 나란히 배치 */}
              <div className="flex flex-col gap-[8px] md:grid md:grid-cols-2 md:gap-[16px]">
                {/* 나의 목표 섹션 */}
                <div className="bg-white rounded-[8px] px-[12px] md:px-[16px] pt-[16px] md:pt-[20px] pb-[16px] md:pb-[20px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]">
                  <Typography
                    style="text-body-2-14-regular"
                    className="md:text-body-1-16-regular text-neutral-70 mb-[16px]"
                    fontFamily="pretendard"
                  >
                    나의 목표
                  </Typography>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-[20px]">
                      <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                        로딩 중...
                      </Typography>
                    </div>
                  ) : goals.length === 0 ? (
                    <div className="flex items-center justify-center py-[20px]">
                      <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                        등록된 목표가 없습니다
                      </Typography>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-[8px] mb-[16px]">
                        {goals.map((goal) => (
                          <div key={goal.id} className="flex items-center justify-between py-[8px]">
                            <div className="flex gap-[8px] items-center">
                              <GoalAccountIcon bgColor={goal.iconBg} />
                              <div className="flex flex-col gap-[2px]">
                                <Typography
                                  style="text-body-2-14-semi-bold"
                                  className="text-neutral-90"
                                  fontFamily="pretendard"
                                >
                                  {goal.name}
                                </Typography>
                                <Typography
                                  style="text-caption-1-12-regular"
                                  className="text-neutral-70"
                                  fontFamily="pretendard"
                                >
                                  {formatCurrency(goal.amount)}
                                </Typography>
                              </div>
                            </div>
                            <div className="w-[18px] h-[18px] flex items-center justify-center">
                              <MoreViewButton />
                            </div>
                          </div>
                        ))}
                      </div>
                      {totalGoalCount > 3 && (
                        <button
                          onClick={() => navigate('/goal/current')}
                          className="w-full bg-white border border-neutral-10 rounded-[4px] p-[8px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]"
                        >
                          <Typography
                            style="text-body-2-14-regular"
                            className="text-neutral-70 text-center"
                            fontFamily="pretendard"
                          >
                            목표 {totalGoalCount}개 전체보기
                          </Typography>
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* 연결된 은행 및 계좌 섹션 */}
                <div className="bg-white rounded-[8px] px-[12px] md:px-[16px] pt-[16px] md:pt-[20px] pb-[16px] md:pb-[20px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]">
                  <Typography
                    style="text-body-2-14-regular"
                    className="md:text-body-1-16-regular text-neutral-70 mb-[16px]"
                    fontFamily="pretendard"
                  >
                    연결된 은행 및 계좌
                  </Typography>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-[20px]">
                      <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                        로딩 중...
                      </Typography>
                    </div>
                  ) : accounts.length === 0 ? (
                    <div className="flex items-center justify-center py-[20px]">
                      <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                        연결된 계좌가 없습니다
                      </Typography>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-[8px] mb-[16px]">
                        {accounts.map((account, index) => (
                          <div key={account.accountId} className="flex items-center justify-between py-[8px]">
                            <div className="flex gap-[8px] items-center">
                              <GoalAccountIcon bgColor={GOAL_COLORS[index % GOAL_COLORS.length]} />
                              <div className="flex flex-col gap-[2px]">
                                <Typography
                                  style="text-body-2-14-semi-bold"
                                  className="text-neutral-90"
                                  fontFamily="pretendard"
                                >
                                  {formatCurrency(account.balanceAmount)}
                                </Typography>
                                <Typography
                                  style="text-caption-1-12-regular"
                                  className="text-neutral-70"
                                  fontFamily="pretendard"
                                >
                                  {account.accountName}
                                </Typography>
                              </div>
                            </div>
                            <div className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] flex items-center justify-center">
                              <MoreViewButton />
                            </div>
                          </div>
                        ))}
                      </div>
                      {totalAccountCount > 3 && (
                        <button
                          onClick={() => navigate('/asset')}
                          className="w-full bg-white border border-neutral-10 rounded-[4px] p-[8px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]"
                        >
                          <Typography
                            style="text-body-2-14-regular"
                            className="text-neutral-70 text-center"
                            fontFamily="pretendard"
                          >
                            자산 {totalAccountCount}개 전체보기
                          </Typography>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* 이번 달 지출과 MBTI를 데스크탑에서 나란히 배치 */}
              <div className="flex flex-col gap-[8px] md:grid md:grid-cols-2 md:gap-[16px]">
                {/* 이번 달 지출 섹션 */}
                <div className="bg-white rounded-[8px] px-[12px] md:px-[16px] pt-[16px] md:pt-[20px] pb-[16px] md:pb-[20px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]">
                  <Typography
                    style="text-body-2-14-regular"
                    className="md:text-body-1-16-regular text-neutral-70 mb-[16px]"
                    fontFamily="pretendard"
                  >
                    이번 달 지출
                  </Typography>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-[20px]">
                      <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                        로딩 중...
                      </Typography>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-[4px] mb-[16px]">
                        <div className="flex items-center gap-[2px]">
                          <Typography
                            style="text-headline-3-18-semi-bold"
                            className="text-black tracking-[-0.36px]"
                            fontFamily="pretendard"
                          >
                            {formatCurrency(transactionSummary?.totalExpense || 0)}
                          </Typography>
                        </div>
                        {transactionSummary && transactionSummary.diffFromLastMonth !== 0 && (
                          <Typography
                            style="text-body-3-13-regular"
                            className="text-neutral-70"
                            fontFamily="pretendard"
                          >
                            지난 달 같은 기간보다{' '}
                            <span className="font-medium text-neutral-90">
                              {formatCurrency(Math.abs(transactionSummary.diffFromLastMonth))}
                            </span>
                            {transactionSummary.diffFromLastMonth > 0 ? ' 더' : ' 덜'} 썼어요
                          </Typography>
                        )}
                      </div>
                      <div className="flex flex-col gap-[12px]">
                        {/* 오늘 지출 */}
                        <div className="flex items-center gap-[8px] md:gap-[12px]">
                          <div className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                            <img src={SpendTodayIcon} alt="오늘 지출" className="w-8 h-8 md:w-10 md:h-10" />
                          </div>
                          <div className="flex flex-col gap-[2px]">
                            <Typography
                              style="text-body-2-14-regular"
                              className="text-neutral-70"
                              fontFamily="pretendard"
                            >
                              오늘 지출
                            </Typography>
                            <Typography
                              style="text-body-2-14-semi-bold"
                              className="text-neutral-90"
                              fontFamily="pretendard"
                            >
                              {formatCurrency(todayExpense)}
                            </Typography>
                          </div>
                        </div>
                        {/* 어제 지출 */}
                        <div className="flex items-center gap-[8px] md:gap-[12px]">
                          <div className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                            <img src={SpendYesterdayIcon} alt="어제 지출" className="w-8 h-8 md:w-10 md:h-10" />
                          </div>
                          <div className="flex flex-col gap-[2px]">
                            <Typography
                              style="text-body-2-14-regular"
                              className="text-neutral-70"
                              fontFamily="pretendard"
                            >
                              어제 지출
                            </Typography>
                            <Typography
                              style="text-body-2-14-semi-bold"
                              className="text-neutral-90"
                              fontFamily="pretendard"
                            >
                              {formatCurrency(yesterdayExpense)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* MBTI 섹션 */}
                <div className="bg-white rounded-[8px] px-[12px] md:px-[16px] pt-[16px] md:pt-[20px] pb-[16px] md:pb-[20px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]">
                  <div className="flex flex-col gap-[4px] mb-[16px]">
                    <Typography
                      style="text-body-2-14-regular"
                      className="md:text-body-1-16-regular text-neutral-70"
                      fontFamily="pretendard"
                    >
                      회원님의 금융 MBTI는?
                    </Typography>
                    {isLoading ? (
                      <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                        로딩 중...
                      </Typography>
                    ) : (
                      <Typography
                        style="text-headline-3-18-semi-bold"
                        className="md:text-headline-2-20-semi-bold text-neutral-90 tracking-[-0.36px]"
                        fontFamily="pretendard"
                      >
                        {mbtiResult || 'MBTI 결과가 없습니다'}
                      </Typography>
                    )}
                  </div>
                  <div className="w-full h-[146px] md:h-[180px] rounded-[4px] flex items-center justify-center overflow-hidden">
                    {mbtiTestResult?.icon ? (
                      <div className="w-full h-full flex items-center justify-center">
                        {(() => {
                          const Icon = mbtiTestResult.icon;
                          return Icon ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon
                                style={{
                                  width: '120%',
                                  height: '120%',
                                  maxWidth: '120%',
                                  maxHeight: '120%',
                                  objectFit: 'contain',
                                }}
                              />
                            </div>
                          ) : (
                            <img src={MbtiHomeIcon} alt="금융 MBTI" className="w-full h-full object-contain" />
                          );
                        })()}
                      </div>
                    ) : (
                      <img src={MbtiHomeIcon} alt="금융 MBTI" className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              </div>

              {/* 맞춤 상품 섹션 */}
              <div className="bg-white rounded-[8px] px-[12px] md:px-[16px] pt-[16px] md:pt-[20px] pb-[16px] md:pb-[20px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]">
                <div className="flex flex-col gap-[4px] mb-[16px]">
                  <Typography
                    style="text-body-2-14-regular"
                    className="md:text-body-1-16-regular text-neutral-50"
                    fontFamily="pretendard"
                  >
                    회원님과 같은 유형을 위한
                  </Typography>
                  <Typography
                    style="text-headline-3-18-semi-bold"
                    className="md:text-headline-2-20-semi-bold text-neutral-90 tracking-[-0.36px]"
                    fontFamily="pretendard"
                  >
                    맞춤 상품이에요
                  </Typography>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-[20px]">
                    <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                      로딩 중...
                    </Typography>
                  </div>
                ) : recommendedProducts.length === 0 ? (
                  <div className="flex items-center justify-center py-[20px]">
                    <Typography style="text-body-2-14-regular" className="text-neutral-50" fontFamily="pretendard">
                      추천 상품이 없습니다
                    </Typography>
                  </div>
                ) : (
                  <div className="flex gap-[12px] overflow-x-auto px-[12px] -mx-[12px] md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:px-0 md:mx-0">
                    {recommendedProducts.map((product, index) => (
                      <div
                        key={index}
                        className="bg-neutral-10 rounded-[16px] p-[16px] min-w-[221px] md:min-w-0 flex flex-col gap-[4px]"
                      >
                        <Typography
                          style="text-body-1-16-semi-bold"
                          className="text-neutral-90 leading-[1.3]"
                          fontFamily="pretendard"
                        >
                          {product.finPrdtNm}
                        </Typography>
                        <Typography
                          style="text-body-3-13-regular"
                          className="text-neutral-50 leading-[1.3]"
                          fontFamily="pretendard"
                        >
                          {product.korCoNm}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation - 모바일 전용 */}
          <div className="fixed bottom-0 left-0 w-full md:hidden">
            <BottomNavigation activeItem="home" onItemClick={handleNavClick} />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
