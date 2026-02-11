import ibkIcon from '@/assets/icons/bank/ibk.svg';
import kdbIcon from '@/assets/icons/bank/kdb.svg';
import kbIcon from '@/assets/icons/bank/kb.svg';
import suhyupIcon from '@/assets/icons/bank/suhyup.svg';
import nhIcon from '@/assets/icons/bank/nh.svg';
import wooriIcon from '@/assets/icons/bank/woori.svg';
import scIcon from '@/assets/icons/bank/sc.svg';
import citiIcon from '@/assets/icons/bank/citi.svg';
import busanIcon from '@/assets/icons/bank/busan_gyeongnam.svg';
import gwangjuIcon from '@/assets/icons/bank/gwangju_jeonbuk.svg';
import saemaulIcon from '@/assets/icons/bank/saemaul.svg';
import shinhyupIcon from '@/assets/icons/bank/shinhyup.svg';
import postbankIcon from '@/assets/icons/bank/postbank.svg';
import hanaIcon from '@/assets/icons/bank/hana.svg';
import kbankIcon from '@/assets/icons/bank/kbank.svg';

import { ColorToken } from '@/shared/styles/design-system';

export interface Banner {
  id: string;
  name: string;
  icon: string;
  color: ColorToken;
}

export const BANNER: Banner[] = [
  { id: 'ibk', name: '산업은행', icon: ibkIcon, color: 'bank-ibk' },
  { id: 'kdb', name: '기업은행', icon: kdbIcon, color: 'bank-kdb' },
  { id: 'kb', name: '국민은행', icon: kbIcon, color: 'bank-kb' },
  { id: 'suhyup', name: '수협은행', icon: suhyupIcon, color: 'bank-suhyup' },
  { id: 'nh', name: '농협은행', icon: nhIcon, color: 'bank-nh' },
  { id: 'woori', name: '우리은행', icon: wooriIcon, color: 'bank-woori' },
  { id: 'sc', name: 'SC은행', icon: scIcon, color: 'bank-sc' },
  { id: 'citi', name: '씨티은행', icon: citiIcon, color: 'bank-citi' },
  { id: 'busan', name: '부산은행', icon: busanIcon, color: 'bank-busan' },
  { id: 'gwangju', name: '광주은행', icon: gwangjuIcon, color: 'bank-gwangju_jeonbuk' },
  { id: 'saemaul', name: '새마을금고', icon: saemaulIcon, color: 'bank-saemaul' },
  { id: 'shinhyup', name: '신협은행', icon: shinhyupIcon, color: 'bank-shinhyup' },
  { id: 'postbank', name: '우체국', icon: postbankIcon, color: 'bank-postbank' },
  { id: 'hana', name: '하나은행', icon: hanaIcon, color: 'bank-hana' },
  { id: 'kbank', name: 'K뱅크', icon: kbankIcon, color: 'bank-kbank' },
];
