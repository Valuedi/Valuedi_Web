import WIcon from '@/assets/icons/asset/W.svg';
import LeisureIcon from '@/assets/icons/asset/Leisure.svg';
import TrafficIcon from '@/assets/icons/asset/Traffic.svg';
import FoodIcon from '@/assets/icons/asset/Food.svg';
import ShoppingIcon from '@/assets/icons/asset/Shopping.svg';
import DefaultIcon from '@/assets/icons/asset/Default.svg';

export interface CategoryStyle {
  bgColor: string;
  icon: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  transfer: { bgColor: 'bg-atomic-yellow-90', icon: WIcon }, // 이체
  shopping: { bgColor: 'bg-atomic-light-blue-90', icon: ShoppingIcon }, // 쇼핑
  traffic: { bgColor: 'bg-atomic-red-90', icon: TrafficIcon }, // 교통
  food: { bgColor: 'bg-atomic-yellow-90', icon: FoodIcon }, // 음식
  leisure: { bgColor: 'bg-neutral-10', icon: LeisureIcon }, // 여가
  default: { bgColor: 'bg-neutral-30', icon: DefaultIcon }, // 기본값
};
