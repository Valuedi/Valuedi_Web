import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/components';
import { cn } from '@/utils/cn';
import splashBg from '@/assets/images/splash/splash_bg.svg';
import splashLogo from '@/assets/images/splash/splash_logo.svg';
import splashRotated from '@/assets/images/splash/splash_rotated.svg';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={cn('min-h-screen w-full bg-white flex justify-center items-center')}>
      <div className={cn('w-full max-w-[360px] min-h-screen bg-white relative flex flex-col overflow-hidden')}>
        {/* 배경 이미지 */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[800px] animate-float-background'
          )}
        >
          <img src={splashBg} alt="" className={cn('w-full h-full object-cover')} />
          <div className={cn('absolute inset-0 animate-shimmer')} />
        </div>

        {/* 회전된 이미지 (왼쪽) */}
        <div
          className={cn(
            'absolute left-[116.87px] top-[343.7px] w-[118.26px] h-[65.615px] flex items-center justify-center z-10'
          )}
        >
          <div className={cn('-rotate-90')}>
            <img src={splashRotated} alt="" className={cn('w-[65.615px] h-[118.26px]')} />
          </div>
        </div>

        {/* 중앙 로고 */}
        <div className={cn('flex flex-col items-center justify-center min-h-screen w-full relative z-10')}>
          <div className={cn('absolute left-[124px] top-[425.31px] w-[100px] h-[23px]')}>
            <img src={splashLogo} alt="Valuedi" className={cn('w-full h-full')} />
          </div>
        </div>

        {/* 하단 텍스트 */}
        <Typography
          style="text-body-2-14-regular"
          className={cn('absolute bottom-[83px] text-center w-[320px] left-1/2 -translate-x-1/2 z-10')}
          color="neutral-70"
        >
          똑똑한 금융서비스, 밸류디
        </Typography>
      </div>
    </div>
  );
};

export default SplashPage;
