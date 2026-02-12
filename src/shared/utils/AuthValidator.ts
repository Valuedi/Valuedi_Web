export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  return passwordRegex.test(password);
};

export const validateId = (id: string): boolean => {
  const idRegex = /^[a-z0-9]{3,16}$/;
  return idRegex.test(id);
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z가-힣]{2,20}$/;
  const hasSingleJamo = /[ㄱ-ㅎㅏ-ㅣ]/.test(name);
  return nameRegex.test(name) && !hasSingleJamo;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^0\d{8,10}$/;

  return phoneRegex.test(phone);
};

export const validateRRNFront7 = (value: string) => {
  if (!/^\d{7}$/.test(value)) return false;

  const yy = Number(value.slice(0, 2));
  const mm = Number(value.slice(2, 4));
  const dd = Number(value.slice(4, 6));
  const genderCode = Number(value[6]);

  // 월 / 일 범위
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;

  // 성별 코드 (MVP 기준 1~4)
  if (![1, 2, 3, 4].includes(genderCode)) return false;

  // 날짜 유효성
  const fullYear = genderCode <= 2 ? 1900 + yy : 2000 + yy;
  const date = new Date(fullYear, mm - 1, dd);

  return date.getFullYear() === fullYear && date.getMonth() === mm - 1 && date.getDate() === dd;
};
