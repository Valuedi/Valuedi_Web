import APGVIcon from '@/assets/icons/mbti/type/APGV.svg?react';
import APGRIcon from '@/assets/icons/mbti/type/APGR.svg?react';
import APCVIcon from '@/assets/icons/mbti/type/APCV.svg?react';
import APCRIcon from '@/assets/icons/mbti/type/APCR.svg?react';

import AIGVIcon from '@/assets/icons/mbti/type/AIGV.svg?react';
import AIGRIcon from '@/assets/icons/mbti/type/AIGR.svg?react';
import AICVIcon from '@/assets/icons/mbti/type/AICV.svg?react';
import AICRIcon from '@/assets/icons/mbti/type/AICR.svg?react';

import SPGVIcon from '@/assets/icons/mbti/type/SPGV.svg?react';
import SPGRIcon from '@/assets/icons/mbti/type/SPGR.svg?react';
import SPCVIcon from '@/assets/icons/mbti/type/SPCV.svg?react';
import SPCRIcon from '@/assets/icons/mbti/type/SPCR.svg?react';

import SIGVIcon from '@/assets/icons/mbti/type/SIGV.svg?react';
import SIGRIcon from '@/assets/icons/mbti/type/SIGR.svg?react';
import SICVIcon from '@/assets/icons/mbti/type/SICV.svg?react';
import SICRIcon from '@/assets/icons/mbti/type/SICR.svg?react';

export const MBTI_LOCAL_EXTENSIONS: Record<
  string,
  { icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>; subTitle?: string; extraDescription: string }
> = {
  APGV: {
    icon: APGVIcon,
    extraDescription: '계획적이지만 순간적 투자와 모험을 즐겨요 하지만 장기적 안정은 다소 미흡해요',
  },
  APGR: {
    icon: APGRIcon,
    subTitle: '전략적 리스크 테이커',
    extraDescription: '장기 목표를 고려하며 위험을 관리해요. 또한 논리적 판단을 통해 공격적 투자를 추구해요',
  },
  APCV: {
    icon: APCVIcon,
    subTitle: '편안한 보수형 저축가',
    extraDescription: '계획적이지만 투자보다는 안정적 저축, 금융 결정을 미루는 경향이 있어요',
  },
  APCR: {
    icon: APCRIcon,
    subTitle: '목표지향형 절약가',
    extraDescription: '재무 목표를 세우고 계획적으로 소비, 안정성과 목표 달성을 동시에 추구해요',
  },

  AIGV: {
    icon: AIGVIcon,
    extraDescription: '불안한데 가만있기 싫어서, 일단 질러보고 생각해요',
  },
  AIGR: {
    icon: AIGRIcon,
    subTitle: '계획적 공격형 도전자',
    extraDescription:
      '위험을 감수하지만 목표 달성을 위해 전략적으로 투자하고, 충동적이지만 논리적 판단을 시도하는 편이에요',
  },
  AICV: {
    icon: AICVIcon,
    extraDescription: '불안해서 혼자 결정은 어렵고, 안전해 보이면 그냥 따라가요',
  },
  AICR: {
    icon: AICRIcon,
    subTitle: '신중한 목표형 전략가',
    extraDescription: '위험은 싫지만 목표 달성 의지가 강함, 계획보다는 순간의 충동 소비를 조절하려 노력해요',
  },

  SPGV: {
    icon: SPGVIcon,
    extraDescription: '큰 걱정은 없고, 세부 관리는 귀찮아요',
  },
  SPGR: {
    icon: SPGRIcon,
    subTitle: '최고 전략가 투자형',
    extraDescription: '논리적 판단을 통해 장기 목표 기반의 공격적 투자를 수행해요. 재무 전략 최적화 되어있어요',
  },
  SPCV: {
    icon: SPCVIcon,
    subTitle: '차분한 보수형 절약가',
    extraDescription: '침착하고 안전을 지향해요. 금융 의사결정을 미루기도 하지만 기본 재무 관리 철저해요',
  },
  SPCR: {
    icon: SPCRIcon,
    subTitle: '계획형 목표 달성가',
    extraDescription: '목표 설정과 달성을 위해 철저히 계획해요. 안정적 저축과 소비 습관 유지해요',
  },

  SIGV: {
    icon: SIGVIcon,
    subTitle: '공격형 즉흥 투자자',
    extraDescription: '감정적 투자 성향이에요. 순간의 재미와 기회 포착을 즐겨요',
  },
  SIGR: {
    icon: SIGRIcon,
    subTitle: '전략형 공격적 투자자',
    extraDescription: '논리적 판단 기반해요. 모험적 투자 가능하고 장기 목표와 수익 균형을 추구해요',
  },
  SICV: {
    icon: SICVIcon,
    subTitle: '불안형 충동 소비자',
    extraDescription: '크게 잃지 않는 게 중요하고, 생각하기 귀찮지만, 큰일 날 선택은 안 해요',
  },
  SICR: {
    icon: SICRIcon,
    subTitle: '계획형 목표 달성 저축가',
    extraDescription: '안정적 성향에 목표 지향적이에요. 장기 재무 계획을 위해 노력해요',
  },
};
