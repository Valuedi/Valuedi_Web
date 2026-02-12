import React, { useEffect } from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components';
import CheckBoxButton from '@/shared/components/buttons/CheckBoxButton';
import { MoreViewButton } from '@/shared/components/buttons/MoreViewButton';

// 약관 데이터 정의 (필수 여부 포함)
// Swagger /api/terms 기준:
// 1: AGE_14 - "만 14세 이상입니다." (필수)
// 2: SERVICE - "밸류디 이용약관 동의" (필수)
// 3: SECURITY - "밸류디 전자금융거래 이용약관 동의" (필수)
// 4: PRIVACY - "밸류디 개인정보 수집 및 이용 동의" (필수)
// 5: MARKETING - "마케팅 목적의 개인정보 수집 및 이용 동의" (선택)
const TERMS_LIST = [
  { id: 'age', label: '[필수] 만 14세 이상입니다.', required: true }, // termsId 1
  { id: 'service', label: '[필수] 밸류디 이용약관 동의', required: true }, // termsId 2
  { id: 'security', label: '[필수] 밸류디 전자금융거래 이용약관 동의', required: true }, // termsId 3
  { id: 'privacy', label: '[필수] 밸류디 개인정보 수집 및 이용 동의', required: true }, // termsId 4
  { id: 'marketing', label: '[선택] 마케팅 목적의 개인정보 수집 및 이용 동의', required: false }, // termsId 5
];

interface TermsAgreementProps {
  onRequirementChange?: (isValid: boolean) => void; // 💡 부모에게 필수 동의 여부 전달
  onTermsChange?: (terms: Record<string, boolean>) => void; // 💡 약관 동의 상태 전달
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({ onRequirementChange, onTermsChange }) => {
  const [terms, setTerms] = React.useState<Record<string, boolean>>({
    age: false,
    service: false,
    security: false,
    privacy: false,
    marketing: false,
  });

  // 1. 전체 동의 로직
  const isAllChecked = Object.values(terms).every(Boolean);

  const handleAllCheck = () => {
    const newValue = !isAllChecked;
    const newTerms = { ...terms };
    Object.keys(newTerms).forEach((key) => (newTerms[key] = newValue));
    setTerms(newTerms);
  };

  // 2. 개별 체크 로직
  const toggleItem = (id: string) => {
    setTerms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 💡 3. 필수 항목 체크 여부 감시 및 보고
  useEffect(() => {
    const requiredIds = TERMS_LIST.filter((item) => item.required).map((item) => item.id);
    const isRequiredFilled = requiredIds.every((id) => terms[id]);

    // 필수 항목이 다 채워졌는지 부모(SignUpContainer)에 알림
    onRequirementChange?.(isRequiredFilled);
    // 약관 동의 상태 전달
    onTermsChange?.(terms);
  }, [terms, onRequirementChange, onTermsChange]);

  return (
    <div className="flex flex-col text-left w-[320px] mx-auto">
      {/* 라벨 - 이메일/인증번호와 동일 */}
      <div className="h-[28px] flex items-start">
        <Typography variant="body-2" weight="semi-bold" className="text-text-body">
          약관 동의
        </Typography>
      </div>

      {/* 전체 동의 영역 */}
      <div className="flex items-center gap-3 min-w-0 cursor-pointer mt-0 mb-3" onClick={handleAllCheck}>
        <CheckBoxButton isChecked={isAllChecked} />
        <Typography variant="body-2" weight="bold" className={isAllChecked ? 'text-neutral-100' : 'text-neutral-60'}>
          전체 동의
        </Typography>
      </div>

      <div className="w-full h-[1px] bg-neutral-10 mb-3" />

      {/* 개별 항목 리스트 */}
      <div className="flex flex-col gap-[8px]">
        {TERMS_LIST.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between cursor-pointer w-full min-h-[28px] py-[4px]"
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <CheckBoxButton isChecked={terms[item.id]} />
              <Typography
                variant="body-2"
                className={cn('transition-colors', terms[item.id] ? 'text-neutral-100' : 'text-neutral-50')}
              >
                {item.label}
              </Typography>
            </div>
            <MoreViewButton
              onClick={(e) => {
                e.stopPropagation();
                console.log(`${item.label} 상세보기`);
              }}
            />
          </div>
        ))}
      </div>

      {/* AuthInput과 동일한 하단 여백 */}
      <div className="h-[24px]" />
    </div>
  );
};
