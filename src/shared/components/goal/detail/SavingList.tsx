import { useMemo, useState } from 'react';
import FoodIcon from '@/assets/icons/goal/FoodIcon.svg';
import GameIcon from '@/assets/icons/goal/GameIcon.svg';
import BusIcon from '@/assets/icons/goal/BusIcon.svg';
import ShoppingIcon from '@/assets/icons/goal/ShoppingIcon.svg';
import SavingInputBottomSheet, { type SavingCategoryItem } from './SavingInputBottomSheet';

interface SavingListProps {
  /** 카테고리 절약 금액 총합이 변경될 때마다 호출 (단위: 원) */
  onTotalChange?: (totalAmount: number) => void;
}

const SavingList = ({ onTotalChange }: SavingListProps) => {
  const initialItems: SavingCategoryItem[] = useMemo(
    () => [
      { id: 1, title: '식비에서', icon: FoodIcon },
      { id: 2, title: '쇼핑에서', icon: ShoppingIcon },
      { id: 3, title: '교통비에서', icon: BusIcon },
      { id: 4, title: '여가에서', icon: GameIcon },
    ],
    []
  );

  const [items, setItems] = useState<SavingCategoryItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const selectedItem = useMemo(() => items.find((x) => x.id === selectedId) ?? null, [items, selectedId]);

  const handleOpen = (id: number) => {
    setSelectedId(id);
    setIsSheetOpen(true);
  };

  const handleClose = () => {
    setIsSheetOpen(false);
  };

  const handleConfirm = (id: number, amountWon: number) => {
    setItems((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, amountWon } : x));
      if (onTotalChange) {
        const total = next.reduce((sum, item) => sum + (item.amountWon ?? 0), 0);
        onTotalChange(total);
      }
      return next;
    });
    setIsSheetOpen(false);
  };

  return (
    <>
      <div className="px-5 flex flex-col gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleOpen(item.id)}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-xl"
          >
            <div className="flex items-center gap-2 ">
              <div className={`w-7 h-7 rounded-lg bg-neutral-10 flex items-center justify-center flex-shrink-0`}>
                <img src={item.icon} alt={item.title} />
              </div>
              <span className="text-sm font-bold">{item.title}</span>
            </div>
            <span className="text-sm font-bold text-gray-400">
              {item.amountWon ? `${item.amountWon.toLocaleString('ko-KR')}원 절약` : '???원 절약'}
            </span>
          </button>
        ))}
      </div>

      <SavingInputBottomSheet
        isOpen={isSheetOpen}
        onClose={handleClose}
        item={selectedItem}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default SavingList;
