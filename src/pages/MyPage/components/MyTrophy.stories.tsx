import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyTrophy from './MyTrophy';
import type { Trophy, MyTrophy as MyTrophyType } from '@/features/trophy/trophy.types';

// React Query를 위한 QueryClient 생성
const createQueryClient = (mockData?: {
  allTrophies?: Trophy[];
  dailyTrophies?: MyTrophyType[];
  monthlyTrophies?: MyTrophyType[];
  shouldError?: boolean;
}) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDate = String(now.getDate()).padStart(2, '0');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity, // 캐시된 데이터를 무한정 유지하여 쿼리 함수가 실행되지 않도록 함
        // 쿼리 함수를 모킹하여 실제 API 호출을 방지
        queryFn: async (context) => {
          const queryKey = context.queryKey;

          // 에러 상태 시뮬레이션
          if (mockData?.shouldError) {
            throw new Error('트로피를 불러오는 중 오류가 발생했습니다.');
          }

          // 쿼리 키에 따라 적절한 목 데이터 반환
          if (queryKey[0] === 'trophies') {
            return mockData?.allTrophies || [];
          }

          if (queryKey[0] === 'myTrophies' && queryKey[1] === 'DAILY') {
            return mockData?.dailyTrophies || [];
          }

          if (queryKey[0] === 'myTrophies' && queryKey[1] === 'MONTHLY') {
            return mockData?.monthlyTrophies || [];
          }

          return [];
        },
      },
    },
  });

  // 목 데이터를 캐시에 미리 설정 (초기 렌더링 시 즉시 사용 가능하도록)
  if (mockData && !mockData.shouldError) {
    // 성공 상태: 데이터를 캐시에 설정
    queryClient.setQueryData(['trophies'], mockData.allTrophies || []);
    queryClient.setQueryData(
      ['myTrophies', 'DAILY', `${currentYear}-${currentMonth}-${currentDate}`],
      mockData.dailyTrophies || []
    );
    queryClient.setQueryData(
      ['myTrophies', 'MONTHLY', `${currentYear}-${currentMonth}`],
      mockData.monthlyTrophies || []
    );
  }

  return queryClient;
};

// 목 데이터
const mockTrophies: Trophy[] = [
  {
    trophyId: 1,
    name: '커피 중독자',
    type: 'COFFEE_ADDICT',
    description: '하루에 커피를 3잔 이상 마셔요.',
  },
  {
    trophyId: 2,
    name: '야식의 왕',
    type: 'LATE_NIGHT_SNACK',
    description: '밤 10시 이후에 음식을 주문해요.',
  },
  {
    trophyId: 3,
    name: '무지출 데이',
    type: 'NO_SPEND_DAY',
    description: '하루 동안 한 번도 지출하지 않았어요.',
  },
  {
    trophyId: 4,
    name: '최다 지출',
    type: 'MAX_SPEND',
    description: '하루 최대 지출 금액을 기록했어요.',
  },
  {
    trophyId: 5,
    name: '최소 지출',
    type: 'MIN_SPEND',
    description: '하루 최소 지출 금액을 기록했어요.',
  },
];

const mockDailyTrophies: MyTrophyType[] = [
  {
    trophyId: 1,
    name: '커피 중독자',
    type: 'COFFEE_ADDICT',
    achievedCount: 2,
    metricValue: '3잔',
  },
  {
    trophyId: 3,
    name: '무지출 데이',
    type: 'NO_SPEND_DAY',
    achievedCount: 1,
    metricValue: '0원',
  },
];

const mockMonthlyTrophies: MyTrophyType[] = [
  {
    trophyId: 1,
    name: '커피 중독자',
    type: 'COFFEE_ADDICT',
    achievedCount: 15,
    metricValue: '45잔',
  },
  {
    trophyId: 2,
    name: '야식의 왕',
    type: 'LATE_NIGHT_SNACK',
    achievedCount: 8,
    metricValue: '8회',
  },
];

// React Query 모킹을 위한 Wrapper 컴포넌트
const QueryWrapper = ({
  children,
  mockData,
}: {
  children: React.ReactNode;
  mockData?: {
    allTrophies?: Trophy[];
    dailyTrophies?: MyTrophyType[];
    monthlyTrophies?: MyTrophyType[];
    shouldError?: boolean;
  };
}) => {
  const queryClient = createQueryClient(mockData);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const meta = {
  title: 'Pages/MyPage/MyTrophy',
  component: MyTrophy,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const mockData = context.parameters.mockData;
      return (
        <QueryWrapper mockData={mockData}>
          <Story />
        </QueryWrapper>
      );
    },
  ],
} satisfies Meta<typeof MyTrophy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    mockData: {
      allTrophies: mockTrophies,
      dailyTrophies: [],
      monthlyTrophies: [],
    },
  },
};

export const WithEarnedTrophies: Story = {
  parameters: {
    mockData: {
      allTrophies: mockTrophies,
      dailyTrophies: mockDailyTrophies,
      monthlyTrophies: mockMonthlyTrophies,
    },
  },
};

export const OnlyDailyTrophies: Story = {
  parameters: {
    mockData: {
      allTrophies: mockTrophies,
      dailyTrophies: mockDailyTrophies,
      monthlyTrophies: [],
    },
  },
};

export const OnlyMonthlyTrophies: Story = {
  parameters: {
    mockData: {
      allTrophies: mockTrophies,
      dailyTrophies: [],
      monthlyTrophies: mockMonthlyTrophies,
    },
  },
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      // 로딩 상태를 시뮬레이션하기 위해 쿼리 데이터를 설정하지 않음
      // 쿼리가 실행되지만 완료되지 않도록 함
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            queryFn: async () => {
              // 무한정 대기하여 로딩 상태 유지
              await new Promise(() => {});
              return [];
            },
          },
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export const Empty: Story = {
  parameters: {
    mockData: {
      allTrophies: [],
      dailyTrophies: [],
      monthlyTrophies: [],
    },
  },
};

export const ErrorState: Story = {
  decorators: [
    (Story) => {
      // 에러 상태를 시뮬레이션하기 위해 쿼리 함수에서 에러를 throw
      const queryClient = createQueryClient({
        shouldError: true,
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export const PartialError: Story = {
  decorators: [
    (Story) => {
      // 전체 트로피 목록은 성공, 일간/월간 트로피는 에러
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            queryFn: async (context) => {
              const queryKey = context.queryKey;

              // 전체 트로피 목록은 성공
              if (queryKey[0] === 'trophies') {
                return mockTrophies;
              }

              // 일간/월간 트로피는 에러
              if (queryKey[0] === 'myTrophies') {
                throw new Error('트로피를 불러오는 중 오류가 발생했습니다.');
              }

              return [];
            },
          },
        },
      });

      // 전체 트로피 목록은 캐시에 미리 설정
      queryClient.setQueryData(['trophies'], mockTrophies);

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};
