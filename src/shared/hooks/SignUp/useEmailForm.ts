import { useEffect, useMemo, useRef, useState, ChangeEvent } from 'react';
import { sendEmailVerificationApi, verifyEmailApi, ApiError } from '@/features/auth';

const DEFAULT_SECONDS = 180;

export const useEmailForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');

  const [isRequested, setIsRequested] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);

  const timerRef = useRef<number | null>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    if (value.length === 0) setEmailError('');
    else if (!/^\S+@\S+\.\S+$/.test(value)) setEmailError('이메일 형식이 올바르지 않습니다.');
    else setEmailError('');

    setIsRequested(false);
    setIsVerified(false);
    setVerifyCode('');
    setVerifyError('');
    setVerifySuccess('');
    setSecondsLeft(DEFAULT_SECONDS);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const handleVerifyCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerifyCode(value);
    setVerifyError('');
    setVerifySuccess('');
  };

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const canResend = useMemo(() => {
    return !!email && !emailError && !isVerified;
  }, [email, emailError, isVerified]);

  const startVerification = async () => {
    if (!canResend) return;

    try {
      const response = await sendEmailVerificationApi({ email });
      if (response.isSuccess) {
        setIsRequested(true);
        setIsVerified(false);
        setVerifyCode('');
        setVerifyError('');
        setVerifySuccess('');
        setSecondsLeft(DEFAULT_SECONDS);

        if (timerRef.current) window.clearInterval(timerRef.current);

        timerRef.current = window.setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              if (timerRef.current) window.clearInterval(timerRef.current);
              timerRef.current = null;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'AUTH429_1') {
          setEmailError('이미 인증번호가 발송되었습니다. 1분 후 다시 시도해 주세요.');
        } else {
          setEmailError('인증번호 발송에 실패했습니다.');
        }
      } else {
        setEmailError('인증번호 발송에 실패했습니다.');
      }
    }
  };

  const confirmVerification = async () => {
    if (verifyCode.length !== 6) {
      setVerifyError('인증번호 6자리를 입력해주세요.');
      return;
    }

    try {
      const response = await verifyEmailApi({ email, code: verifyCode });
      if (response.isSuccess) {
        setIsVerified(true);
        setVerifyError('');
        setVerifySuccess('인증되었습니다.');
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'AUTH400_2') {
          setVerifyError('인증번호가 일치하지 않습니다.');
        } else if (error.code === 'AUTH404_1') {
          setVerifyError('인증번호가 만료되었거나 존재하지 않습니다.');
        } else {
          setVerifyError('인증번호 확인에 실패했습니다.');
        }
      } else {
        setVerifyError('인증번호 확인에 실패했습니다.');
      }
      setIsVerified(false);
      setVerifySuccess('');
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const timerText = isRequested ? formatTime(secondsLeft) : '03:00';

  const isStep2Valid = !!(email && !emailError && isVerified);

  return {
    email,
    emailError,
    verifyCode,
    verifyError,
    verifySuccess,
    isRequested,
    isVerified,
    secondsLeft,
    timerText,
    canResend,

    handleEmailChange,
    handleVerifyCodeChange,
    startVerification,
    confirmVerification,

    isStep2Valid,
  };
};
