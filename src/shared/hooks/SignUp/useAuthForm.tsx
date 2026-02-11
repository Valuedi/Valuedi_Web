import { useState, ChangeEvent, useEffect } from 'react';
import {
  validatePassword,
  validateName,
  validatePhone,
  validateId,
  validateRRNFront7,
} from '@/shared/utils/AuthValidator';
import { checkUsernameApi, ApiError } from '@/features/auth';

export const useAuthForm = () => {
  // 아이디 관련
  const [id, setId] = useState('');
  const [idError, setIdError] = useState('');
  const [idCheckError, setIdCheckError] = useState('');
  const [idCheckSuccess, setIdCheckSuccess] = useState('');
  // 비밀번호 관련 (숫자 2 제거 및 통합)
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [confirmPwError, setConfirmPwError] = useState('');
  const [confirmPwSuccess, setConfirmPwSuccess] = useState('');
  // 이름 관련
  const [userName, setUserName] = useState('');
  const [nameError, setNameError] = useState('');
  // 전화번호 및 인증 관련
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [isRequested, setIsRequested] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  //주민등록번호 관련 핸들러
  const [rrnFront, setRrnFront] = useState('');
  const [rrnBack, setRrnBack] = useState('');
  const [rrnError, setRrnError] = useState('');

  // 기타 상태
  const [isTyping, setIsTyping] = useState(false);

  // --- 2. 통합 비밀번호 검증 로직 (useEffect) ---
  useEffect(() => {
    const isPwInvalid = pw.length > 0 && !validatePassword(pw);
    setPwError(isPwInvalid ? '영문 대소문자, 숫자, 특수문자 포함 8~16자로 입력해주세요.' : '');
    if (confirmPw.length > 0) {
      if (pw !== confirmPw) {
        setConfirmPwError('비밀번호가 일치하지 않습니다.');
        setConfirmPwSuccess('');
      } else if (!isPwInvalid) {
        setConfirmPwError('');
        setConfirmPwSuccess('사용 가능한 비밀번호입니다.');
      } else {
        setConfirmPwError('');
        setConfirmPwSuccess('');
      }
    } else {
      setConfirmPwError('');
      setConfirmPwSuccess('');
    }
  }, [pw, confirmPw]);

  // 주민등록번호 검증 로직 (useEffect)
  useEffect(() => {
    if (rrnFront.length === 0 && rrnBack.length === 0) {
      setRrnError('');
    } else if (rrnFront.length < 6 || rrnBack.length < 1) {
      setRrnError('주민등록번호를 입력해주세요.');
    } else {
      const fullRrn = rrnFront + rrnBack;
      setRrnError(validateRRNFront7(fullRrn) ? '' : '올바르지 않은 주민등록번호 형식입니다.');
    }
  }, [rrnFront, rrnBack]);

  // --- 3. 핸들러 함수 ---
  // 이름 핸들러
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
    setNameError(value.length > 0 && !validateName(value) ? '올바르지 않은 이름 형식입니다.' : '');
  };
  // 아이디 핸들러
  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setId(value);
    setIsTyping(true);
    setIdError(value.length > 0 && !validateId(value) ? '올바른 아이디를 입력해주세요.' : '');
    setIdCheckSuccess('');
    setIdCheckError('');
  };
  // 아이디 중복 확인
  const handleDuplicateCheck = async () => {
    setIsTyping(false);
    if (!validateId(id)) {
      setIdCheckError('사용할 수 없는 아이디 형식입니다.');
      setIdCheckSuccess('');
      return;
    }
    try {
      const response = await checkUsernameApi(id);
      if (response.isSuccess) {
        setIdCheckError('');
        setIdCheckSuccess('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'AUTH409_1') {
          setIdCheckError('이미 사용 중인 아이디입니다.');
          setIdCheckSuccess('');
        } else if (error.code === 'VALID400_1') {
          setIdCheckError('아이디를 입력해주세요.');
          setIdCheckSuccess('');
        } else {
          setIdCheckError('아이디 중복 확인에 실패했습니다.');
          setIdCheckSuccess('');
        }
      } else {
        setIdCheckError('아이디 중복 확인에 실패했습니다.');
        setIdCheckSuccess('');
      }
    }
  };
  // 비밀번호 핸들러
  const handlePwChange = (e: ChangeEvent<HTMLInputElement>) => setPw(e.target.value);
  const handleConfirmPwChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPw(e.target.value);
  // 전화번호 핸들러
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setPhoneError(value.length > 0 && !validatePhone(value) ? '올바르지 않은 전화번호 형식입니다.' : '');
  };

  //주민등록번호 핸들러
  const handleRrnFrontChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setRrnFront(value);
  };

  const handleRrnBackChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
    setRrnBack(value);
  };
  // 인증번호 핸들러
  const handleVerifyCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVerifyCode(value);
    setVerifyError('');
    setVerifySuccess('');
  };
  // 인증번호 확인 핸들러
  const handleVerifyButtonClick = () => {
    // 테스트용 목업 번호 '123456'
    if (verifyCode === '123456') {
      setIsVerified(true);
      setVerifyError('');
      setVerifySuccess('인증되었습니다.');
    } else {
      setIsVerified(false);
      setVerifyError('올바르지 않은 인증번호입니다.');
      setVerifySuccess('');
    }
  };
  // --- 4. 값 반환 ---
  return {
    // 상태값들
    id,
    idError,
    idCheckError,
    idCheckSuccess,
    pw,
    pwError,
    rrnFront,
    rrnBack,
    rrnError,
    confirmPw,
    confirmPwError,
    confirmPwSuccess,
    userName,
    nameError,
    phone,
    phoneError,
    verifyCode,
    verifyError,
    verifySuccess,
    isRequested,
    isVerified,
    isTyping,

    // 상태 변경 함수들
    setVerifyCode,
    setIsRequested,

    // 핸들러 함수들
    handleNameChange,
    handleIdChange,
    handleDuplicateCheck,
    handlePwChange,
    handleRrnFrontChange,
    handleRrnBackChange,
    handleConfirmPwChange,
    handlePhoneChange,
    handleVerifyButtonClick,
    handleVerifyCodeChange,
  };
};
