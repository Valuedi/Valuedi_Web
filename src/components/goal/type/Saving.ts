export interface SavingCategory {
  id: 'FOOD' | 'ENTERTAINMENT' | 'TRANSPORT' | 'SHOPPING';
  label: string;
  icon: string;
}

import FoodIcon from '@/assets/icons/goal/FoodIcon.svg';
import GameIcon from '@/assets/icons/goal/GameIcon.svg';
import BusIcon from '@/assets/icons/goal/BusIcon.svg';
import ShoppingIcon from '@/assets/icons/goal/ShoppingIcon.svg';

export const SAVING_CATEGORIES: SavingCategory[] = [
  { id: 'FOOD', label: '식비에서', icon: FoodIcon },
  { id: 'ENTERTAINMENT', label: '오락에서', icon: GameIcon },
  { id: 'TRANSPORT', label: '교통에서', icon: BusIcon },
  { id: 'SHOPPING', label: '쇼핑에서', icon: ShoppingIcon },
];
