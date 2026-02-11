import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (initialTime: number = 180) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  // 💡 NodeJS.Timeout 대신 number 타입을 사용하거나 Ref로 관리합니다.
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(true);
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      // 💡 window.setInterval을 명시하여 브라우저 API임을 확실히 합니다.
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) window.clearInterval(timerRef.current);
    }

    // 클린업 함수
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, timeLeft]);

  return {
    timeLeft,
    isActive,
    startTimer,
    stopTimer,
    formatTime,
  };
};
