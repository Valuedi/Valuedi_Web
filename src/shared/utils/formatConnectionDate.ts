/**
 * ISO 날짜 문자열을 한국식 날짜 형식으로 포맷팅
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: 2026-02-10T15:21:14)
 * @returns "YYYY년 MM월 DD일" 형식의 문자열
 */
export const formatConnectionDate = (dateString?: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // 유효하지 않은 날짜인 경우 원본 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}년 ${month}월 ${day}일`;
  } catch (error) {
    return dateString || '';
  }
};
