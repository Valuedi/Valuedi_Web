import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Hamburger from '@/assets/icons/Hamburger.svg';
import ExBank from '@/assets/icons/goal/ExBank.svg';
import TotalSection from '@/shared/components/goal/TotalSection';
import GoalBottomSheet from '@/shared/components/goal/GoalBottonSheet';
import type { TransactionItem } from '@/shared/utils/goal/ledgerHelpers';
import { paths } from '@/router/paths';

// 로컬 목데이터용 타입 (실제 API TransactionItem과는 별개)
interface MockTransactionItem {
  id: number;
  type: string;
  amount: string;
  time: string;
  category: string;
  balanceAfter: string;
  account: string;
  isPositive: boolean;
  dateKey: string;
  dateLabel: string;
  rawAmount: number;
}

interface TransactionGroup {
  date: string;
  dailyBalance: string;
  items: MockTransactionItem[];
}

// --- 목데이터 ---
const mockTransactions: TransactionGroup[] = [
  {
    date: '19일 오늘',
    dailyBalance: '23,000 원',
    items: [
      {
        id: 101,
        type: '입금',
        amount: '3,000 원',
        time: '2025.12.03 18:44:44',
        category: '일반이체',
        balanceAfter: '23,000원',
        account: '국민은행 592802-04-170725',
        isPositive: true,
        dateKey: '2025-12-03',
        dateLabel: '3일 오늘',
        rawAmount: 3000,
      },
      {
        id: 102,
        type: '출금',
        amount: '- 13,000 원',
        time: '2025.12.03 15:20:10',
        category: '카드결제',
        balanceAfter: '10,000원',
        account: '우리은행 1002-123-456789',
        isPositive: false,
        dateKey: '2025-12-03',
        dateLabel: '3일 오늘',
        rawAmount: -13000,
      },
    ],
  },
  {
    date: '18일 어제',
    dailyBalance: '230,000 원',
    items: [
      {
        id: 201,
        type: '입금',
        amount: '3,000 원',
        time: '2025.12.02 10:00:00',
        category: '일반이체',
        balanceAfter: '230,000원',
        account: '국민은행 592802-04-170725',
        isPositive: true,
        dateKey: '2025-12-02',
        dateLabel: '2일 어제',
        rawAmount: 3000,
      },
    ],
  },
];

const mockGoals = [
  { id: 1, bankIcon: ExBank, title: '테야테야유럽갈테야', progress: 32, targetAmount: 10000000, remainingDays: 91 },
];

const AmountAchievedPage = () => {
  const [selectedItem, setSelectedItem] = useState<TransactionItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const goal = mockGoals.find((g) => g.id === Number(id)) || mockGoals[0];
  const isCurrentActive = location.pathname === paths.goal.amountAchieved(id || '');
  const isPastActive = location.pathname === paths.goal.savingsSimulation(id || '');

  const handleItemClick = (item: MockTransactionItem) => {
    // 목데이터를 실제 TransactionItem 타입으로 매핑 (GoalBottomSheet가 사용하는 필드만 채움)
    const adapted: TransactionItem = {
      ...item,
      dateKey: '',
      dateLabel: '',
      rawAmount: 0,
    };
    setSelectedItem(adapted);
    setIsSheetOpen(true);
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white">
      {/* 헤더 및 탭 섹션 */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between px-5 py-5">
          <h1 className="text-xl font-bold text-gray-900">목표</h1>
          <button type="button" className="p-1">
            <img src={Hamburger} alt="menu" className="w-6 h-6" />
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex w-full border-b border-gray-200">
          <button
            onClick={() => id && navigate(paths.goal.amountAchieved(id))}
            className={`flex-1 py-4 text-center text-base transition-all ${
              isCurrentActive ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-400'
            }`}
          >
            달성 금액
          </button>
          <button
            onClick={() => id && navigate(paths.goal.savingsSimulation(id))}
            className={`flex-1 py-4 text-center text-base transition-all ${
              isPastActive ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-400'
            }`}
          >
            절약 시뮬레이션
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <TotalSection goal={goal} />

        {/* 구분선 */}
        <div className="-mx-5 h-0.5 w-[calc(100%+2.5rem)] bg-gray-100" />

        {/* 목록 리스트 */}
        <div className="py-2">
          <div className="mb-2 text-lg font-bold text-gray-900">저금 목록</div>

          {/* 리스트 렌더링 */}
          <div className="flex flex-col">
            {mockTransactions.map((group) => (
              <div key={group.date} className="flex flex-col mb-4">
                <div className="flex justify-between py-3 text-sm text-gray-400 border-b border-gray-50">
                  <span>{group.date}</span>
                  <span>{group.dailyBalance}</span>
                </div>
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex justify-between px-1 py-5 transition-colors cursor-pointer active:bg-gray-50"
                  >
                    <span className="text-base font-medium text-gray-600">{item.type}</span>
                    <span className={`text-base font-bold ${item.isPositive ? 'text-gray-900' : 'text-primary-heavy'}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <GoalBottomSheet isOpen={isSheetOpen} item={selectedItem} onClose={() => setIsSheetOpen(false)} />
    </div>
  );
};

export default AmountAchievedPage;
