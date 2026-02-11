import ibkIcon from '@/assets/icons/bank/bgbank/ibk.svg';
import kbIcon from '@/assets/icons/bank/bgbank/kb.svg';
import suhyupIcon from '@/assets/icons/bank/bgbank/suhyup.svg';
import nhIcon from '@/assets/icons/bank/bgbank/nh.svg';
import wooriIcon from '@/assets/icons/bank/bgbank/woori.svg';
import scIcon from '@/assets/icons/bank/bgbank/sc.svg';
import citiIcon from '@/assets/icons/bank/bgbank/citi.svg';
import busanIcon from '@/assets/icons/bank/bgbank/busan_gyeongnam.svg';
import gwangjuIcon from '@/assets/icons/bank/bgbank/gwangju_jeonbuk.svg';
import jejuIcon from '@/assets/icons/bank/bgbank/jeju_shinhan.svg';
import saemaulIcon from '@/assets/icons/bank/bgbank/saemaul.svg';
import shinhyupIcon from '@/assets/icons/bank/bgbank/shinhyup.svg';
import postbankIcon from '@/assets/icons/bank/bgbank/postbank.svg';
import hanaIcon from '@/assets/icons/bank/bgbank/hana.svg';
import kbankIcon from '@/assets/icons/bank/bgbank/kbank.svg';

export interface bgBank {
  id: string;
  name: string;
  icon: string;
}

export const BGBANKS: bgBank[] = [
  { id: 'ibk', name: '기업은행', icon: ibkIcon },
  { id: 'kb', name: '국민은행', icon: kbIcon },
  { id: 'suhyup', name: '수협은행', icon: suhyupIcon },
  { id: 'nh', name: '농협은행', icon: nhIcon },
  { id: 'woori', name: '우리은행', icon: wooriIcon },
  { id: 'sc', name: 'SC은행', icon: scIcon },
  { id: 'citi', name: '씨티은행', icon: citiIcon },
  { id: 'busan', name: '부산은행', icon: busanIcon },
  { id: 'gwangju', name: '광주은행', icon: gwangjuIcon },
  { id: 'jeju', name: '제주은행', icon: jejuIcon },
  { id: 'gyeongnam', name: '경남은행', icon: busanIcon },
  { id: 'saemaul', name: '새마을금고', icon: saemaulIcon },
  { id: 'shinhyup', name: '신협은행', icon: shinhyupIcon },
  { id: 'postbank', name: '우체국', icon: postbankIcon },
  { id: 'hana', name: '하나은행', icon: hanaIcon },
  { id: 'shinhan', name: '신한은행', icon: jejuIcon },
  { id: 'kbank', name: 'K뱅크', icon: kbankIcon },
];
