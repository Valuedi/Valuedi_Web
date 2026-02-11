// 카드사 아이콘 (은행사 아이콘 사용, 카드사별 아이콘이 준비되면 교체 가능)
import kbIcon from '@/assets/icons/bank/kb.svg';
import nhIcon from '@/assets/icons/bank/nh.svg';
import wooriIcon from '@/assets/icons/bank/woori.svg';
import citiIcon from '@/assets/icons/bank/citi.svg';
import gwangjuIcon from '@/assets/icons/bank/gwangju_jeonbuk.svg';
import dgbIcon from '@/assets/icons/bank/dgb.svg';
import suhyupIcon from '@/assets/icons/bank/suhyup.svg';
import jejuIcon from '@/assets/icons/bank/jeju_shinhan.svg';
import hanaIcon from '@/assets/icons/bank/hana.svg';
import shinhanIcon from '@/assets/icons/bank/jeju_shinhan.svg';

export interface Card {
  id: string;
  name: string;
  icon: string;
}
export const CARDS: Card[] = [
  { id: 'kb', name: 'KB카드', icon: kbIcon },
  { id: 'hyundai', name: '현대카드', icon: hanaIcon },
  { id: 'samsung', name: '삼성카드', icon: shinhanIcon },
  { id: 'nh', name: 'NH카드', icon: nhIcon },
  { id: 'bc', name: 'BC카드', icon: kbIcon },
  { id: 'shinhan', name: '신한카드', icon: shinhanIcon },
  { id: 'citi', name: '씨티카드', icon: citiIcon },
  { id: 'woori', name: '우리카드', icon: wooriIcon },
  { id: 'lotte', name: '롯데카드', icon: wooriIcon },
  { id: 'hana', name: '하나카드', icon: hanaIcon },
  { id: 'dgb', name: '전북카드', icon: dgbIcon },
  { id: 'gwangju', name: '광주카드', icon: gwangjuIcon },
  { id: 'suhyup', name: '수협카드', icon: suhyupIcon },
  { id: 'jeju', name: '제주카드', icon: jejuIcon },
];
