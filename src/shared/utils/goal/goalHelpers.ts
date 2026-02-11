export const COLOR_ORDER = [
  'FF6363', // 1. 빨강
  'FF7B2E', // 2. 주황
  'FFA938', // 3. 진한 노랑
  'F8D444', // 4. 밝은 노랑
  '6BE016', // 5. 연두
  '1ED45A', // 6. 초록
  '28D0ED', // 7. 하늘
  '3DC2FF', // 8. 라이트블루
  '3385FF', // 9. 파랑
  '7D5EF7', // 10. 보라
  'D478FF', // 11. 연보라
  'FA73E3', // 12. 핑크
] as const;

export function basenameNoExt(filePath: string) {
  const last = filePath.split('/').pop() ?? filePath;
  return last.replace(/\.svg$/i, '');
}
//YY-MM-DD 형식을 YYYY-MM-DD 형식으로 변환하는 함수
export function formatDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') {
    return dateStr;
  }

  // 이미 YYYY-MM-DD 형식인 경우 그대로 반환
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // YY-MM-DD 형식인 경우 YYYY-MM-DD로 변환
  if (/^\d{2}-\d{2}-\d{2}$/.test(dateStr)) {
    return `20${dateStr}`;
  }

  // 다른 형식인 경우 그대로 반환 (에러 방지)
  return dateStr;
}

/** API에서 받은 날짜(YYYY-MM-DD 또는 ISO)를 입력 필드용 YYYY-MM-DD로 변환 */
export function toInputDate(apiDate: string | undefined): string {
  if (!apiDate || typeof apiDate !== 'string') return '';
  const datePart = apiDate.slice(0, 10);
  // YYYY-MM-DD 형식이면 그대로 반환
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
  // ISO 형식이면 YYYY-MM-DD로 변환
  if (/^\d{4}-\d{2}-\d{2}T/.test(apiDate)) return datePart;
  return apiDate;
}

/** ISO 또는 YYYY-MM-DD 날짜를 YY.MM.DD 형식으로 포맷 */
export function formatToYYMMDD(isoDate: string): string {
  if (!isoDate) return '-';
  const d = new Date(isoDate);
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/** 숫자 입력을 YYYY-MM-DD 형식으로 자동 포맷팅 */
export function formatDateInput(value: string): string {
  if (!value) return '';

  // 이미 YYYY-MM-DD 형식인 경우 그대로 반환
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // 하이픈이 포함된 경우 숫자만 추출하여 재처리
  const numbers = value.replace(/\D/g, '');

  if (numbers.length === 0) return '';

  // 8자리 이상 숫자 (YYYYMMDD)
  if (numbers.length >= 8) {
    const year = numbers.slice(0, 4);
    const month = numbers.slice(4, 6);
    const day = numbers.slice(6, 8);
    return `${year}-${month}-${day}`;
  }

  // 7자리 숫자 (YYYYMMD) - 년도-월-일 형식 (일자가 1자리)
  if (numbers.length === 7) {
    const year = numbers.slice(0, 4);
    const month = numbers.slice(4, 6);
    const day = numbers.slice(6, 7);
    return `${year}-${month}-${day}`;
  }

  // 6자리 숫자 (YYYYMM) - 년도-월 형식
  if (numbers.length === 6) {
    const year = numbers.slice(0, 4);
    const month = numbers.slice(4, 6);
    return `${year}-${month}`;
  }

  // 5자리 이상이면 년도-월 형식으로 포맷팅 (입력 중)
  if (numbers.length >= 5) {
    const year = numbers.slice(0, 4);
    const month = numbers.slice(4, 6);
    return `${year}-${month}`;
  }

  // 4자리 이하는 숫자만 그대로 반환 (입력 중이므로 포맷팅하지 않음)
  return numbers;
}

/** 금액 입력을 3자리마다 콤마가 찍힌 형식으로 자동 포맷팅 */
export function formatAmountInput(value: string): string {
  if (!value) return '';

  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');

  if (numbers.length === 0) return '';

  // 3자리마다 콤마 추가
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 계좌번호 마스킹 (앞자리 유지, 중간 ****, 뒤 2~4자리) */
export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) return '-';
  const parts = accountNumber.replace(/\s/g, '').split('-');
  if (parts.length >= 3) {
    return `${parts[0]}-${parts[1]}-****${parts[parts.length - 1].slice(-2)}`;
  }
  if (parts.length === 1 && parts[0].length >= 4) {
    return `****${parts[0].slice(-4)}`;
  }
  return accountNumber;
}
