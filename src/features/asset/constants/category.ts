import WIcon from '@/assets/icons/asset/W.svg';
import LeisureIcon from '@/assets/icons/asset/Leisure.svg';
import TrafficIcon from '@/assets/icons/asset/Traffic.svg';
//import FoodIcon from '@/assets/icons/asset/Food.svg';
import ShoppingIcon from '@/assets/icons/asset/Shopping.svg';
import MedicalIcon from '@/assets/icons/asset/Medical.svg';
import DishIcon from '@/assets/icons/asset/Dish.svg';
import ShoppingBag from '@/assets/icons/asset/Shopping-Bag.svg';
import LivingIcon from '@/assets/icons/asset/Living.svg';
import CafeIcon from '@/assets/icons/asset/Cafe.svg';
import DefaultIcon from '@/assets/icons/asset/Default.svg';
import OthersIcon from '@/assets/icons/asset/Others.svg';

export interface CategoryStyle {
  bgColor: string;
  barColor: string;
  icon: string;
}

/** 프론트에서 쓰는 카테고리 키 목록 (아이콘/스타일 매칭용) */
const FRONTEND_KEYS = [
  'transfer',
  'traffic',
  'shopping',
  'food',
  'leisure',
  'medical',
  'market',
  'living',
  'cafe',
  'others',
] as const;

/** API에서 오는 카테고리 코드 → 프론트 키 (백엔드 DB code 컬럼 기준) */
const API_CATEGORY_CODE_MAP: Record<string, string> = {
  // 백엔드 DB code (소문자 매칭)
  transfer: 'transfer',
  food: 'food',
  hobby_leisure: 'leisure',
  mart_etc: 'market',
  transport: 'traffic',
  shopping: 'shopping',
  housing_comm: 'living',
  cafe_snack: 'cafe',
  medical_life: 'medical',
  etc: 'others',
  // 레거시/축약 코드
  fd: 'food',
  f: 'food',
  sh: 'shopping',
  tr: 'traffic',
  tf: 'traffic',
  traffic: 'traffic',
  lv: 'living',
  living: 'living',
  md: 'medical',
  medical: 'medical',
  mr: 'market',
  market: 'market',
  cf: 'cafe',
  cafe: 'cafe',
  lr: 'leisure',
  leisure: 'leisure',
  other: 'others',
  others: 'others',
  unknown: 'others',
  '': 'others',
};

/** 백엔드 category.id 또는 sort_order (1~10) → 프론트 키 */
const API_CATEGORY_ID_MAP: Record<number, string> = {
  1: 'transfer',
  2: 'food',
  3: 'leisure',
  4: 'market',
  5: 'traffic',
  6: 'shopping',
  7: 'living',
  8: 'cafe',
  9: 'medical',
  10: 'others',
};

/** API가 categoryName(한글)만 줄 때: 한글 이름 → 프론트 키 (백엔드 DB name 기준) */
const CATEGORY_NAME_TO_KEY: Record<string, string> = {
  // 백엔드 DB name (슬래시 구분)
  이체: 'transfer',
  식비: 'food',
  '취미/여가': 'leisure',
  '편의점/마트/잡화': 'market',
  '교통/자동차': 'traffic',
  쇼핑: 'shopping',
  '주거/통신': 'living',
  '카페/간식': 'cafe',
  '의료/생활': 'medical',
  '카테고리 없음(기타)': 'others',
  // 단일 한글 (API가 일부만 보낼 때)
  교통: 'traffic',
  자동차: 'traffic',
  // 점/공백 구분 변형
  '교통 · 자동차': 'traffic',
  취미: 'leisure',
  여가: 'leisure',
  '취미 · 여가': 'leisure',
  의료: 'medical',
  건강: 'medical',
  '의료 · 건강': 'medical',
  편의점: 'market',
  마트: 'market',
  잡화: 'market',
  '편의점 · 마트 · 잡화': 'market',
  주거: 'living',
  통신: 'living',
  '주거 · 통신': 'living',
  카페: 'cafe',
  디저트: 'cafe',
  '카페 · 디저트': 'cafe',
  그외: 'others',
  기타: 'others',
  음식: 'food',
};

/**
 * API categoryCode / categoryName / categoryId를 프론트 카테고리 키로 통일
 * - categoryId가 있으면 ID 매핑 우선 (DB id 1~10)
 * - 그다음 categoryCode 매핑 (문자열 코드 또는 숫자 문자열=ID)
 * - 없거나 매칭 안 되면 categoryName(한글)으로 매칭
 */
export function normalizeCategoryCode(
  apiCode: string | null | undefined,
  categoryName?: string | null,
  categoryId?: number | string | null
): string {
  const id = categoryId != null ? (typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId) : undefined;
  if (id != null && !Number.isNaN(id) && API_CATEGORY_ID_MAP[id]) return API_CATEGORY_ID_MAP[id];

  const codeRaw = (apiCode ?? '').toString().trim().toLowerCase();
  if (codeRaw && API_CATEGORY_CODE_MAP[codeRaw]) return API_CATEGORY_CODE_MAP[codeRaw];
  if (codeRaw && FRONTEND_KEYS.includes(codeRaw as (typeof FRONTEND_KEYS)[number])) return codeRaw;
  // API가 code 대신 category id를 문자열로 보낼 수 있음 (예: "2" → food)
  const codeAsId = /^\d+$/.test(codeRaw) ? parseInt(codeRaw, 10) : NaN;
  if (!Number.isNaN(codeAsId) && API_CATEGORY_ID_MAP[codeAsId]) return API_CATEGORY_ID_MAP[codeAsId];

  const nameRaw = (categoryName ?? '').toString().trim();
  if (nameRaw && CATEGORY_NAME_TO_KEY[nameRaw]) return CATEGORY_NAME_TO_KEY[nameRaw];
  for (const [name, key] of Object.entries(CATEGORY_NAME_TO_KEY)) {
    if (name.length > 0 && nameRaw.includes(name)) return key;
  }

  return codeRaw || 'others';
}

/** API가 그외(ETC)로 내려줄 때, 거래 제목(가맹점명)으로 카테고리 추정 (백엔드 keyword 미적용 월 보정용) */
const TITLE_KEYWORDS_TO_CATEGORY: { keywords: string[]; key: string }[] = [
  { keywords: ['티머니', '지하철', '후불교통', '교통', '택시', '버스', '카카오택시', '주차'], key: 'traffic' },
  { keywords: ['이체', '펌뱅킹', '토스', '오픈뱅킹'], key: 'transfer' },
  { keywords: ['커피', '카페', '스타벅스', '이디야', '빽다방', '디저트', '제과'], key: 'cafe' },
  { keywords: ['편의점', '세븐일레븐', 'gs25', 'cu', '이마트24', '다이소'], key: 'market' },
  { keywords: ['쿠팡', '올리브영', '백화점', '쇼핑'], key: 'shopping' },
  { keywords: ['식비', '한식', '중식', '일식', '맛집', '배달', '요식'], key: 'food' },
  { keywords: ['의료', '약국', '병원', '치과', '한의원'], key: 'medical' },
  { keywords: ['주거', '통신', '전기', '가스', '관리비'], key: 'living' },
  { keywords: ['영화', '레저', '숙박', '취미', '여가'], key: 'leisure' },
];

export function inferCategoryFromTitle(title: string | null | undefined): string | null {
  const t = (title ?? '').toString().trim();
  if (!t) return null;
  const lower = t.toLowerCase();
  for (const { keywords, key } of TITLE_KEYWORDS_TO_CATEGORY) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) return key;
  }
  return null;
}

// 💡 새로 추가할 한글 라벨 정의
export const CATEGORY_LABELS: Record<string, string> = {
  transfer: '이체',
  traffic: '교통 · 자동차',
  shopping: '쇼핑',
  food: '식비',
  leisure: '취미 · 여가',
  medical: '의료 · 건강',
  market: '편의점 · 마트 · 잡화',
  living: '주거 · 통신',
  cafe: '카페 · 디저트',
  others: '그외', // 상세 페이지에서도 쓰이니 추가해두면 좋아요
  default: '카테고리 없음',
};

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  transfer: { bgColor: 'bg-atomic-yellow-90', barColor: 'bg-atomic-yellow-50', icon: WIcon }, // 이체
  shopping: { bgColor: 'bg-atomic-orange-90', barColor: 'bg-atomic-orange-50', icon: ShoppingBag }, // 쇼핑
  traffic: { bgColor: 'bg-atomic-red-90', barColor: 'bg-atomic-red-50', icon: TrafficIcon }, // 교통
  food: { bgColor: 'bg-atomic-blue-90', barColor: 'bg-atomic-blue-50', icon: DishIcon }, // 음식
  leisure: { bgColor: 'bg-neutral-10', barColor: 'bg-neutral-30', icon: LeisureIcon }, // 여가
  default: { bgColor: 'bg-neutral-30', barColor: 'bg-neutral-50', icon: DefaultIcon }, // 기본값
  medical: { bgColor: 'bg-neutral-40', barColor: 'bg-neutral-60', icon: MedicalIcon }, // 의료
  market: { bgColor: 'bg-atomic-light-blue-90', barColor: 'bg-atomic-light-blue-50', icon: ShoppingIcon }, // 마켓
  living: { bgColor: 'bg-atomic-purple-90', barColor: 'bg-atomic-purple-50', icon: LivingIcon }, // 주거
  cafe: { bgColor: 'bg-atomic-green-90', barColor: 'bg-atomic-green-50', icon: CafeIcon }, // 카페
  others: { bgColor: 'bg-neutral-60', barColor: 'bg-neutral-80', icon: OthersIcon }, // 그외
};
