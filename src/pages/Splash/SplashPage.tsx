import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';
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
    <div className={cn('relative min-h-screen w-full overflow-hidden bg-white')}>
      <div className={cn('absolute inset-0', 'flex items-center justify-center', 'overflow-hidden')}>
        <div className={cn('relative', 'w-screen h-screen min-w-full min-h-full', 'md:w-screen md:h-screen')}>
          <img
            src={splashBg}
            alt=""
            className={cn('w-full h-full object-cover')}
            style={{ minWidth: '100vw', minHeight: '100vh' }}
          />
        </div>
      </div>

      {/* 콘텐츠 레이어 */}
      <div
        className={cn(
          'relative z-10 flex flex-col items-center justify-center',
          'min-h-screen w-full',
          'transform-none'
        )}
      >
        {/* 중앙 콘텐츠 영역 */}
        <div className={cn('flex flex-col items-center justify-center gap-4', 'transform-none')}>
          <div className={cn('flex items-center justify-center', 'w-[118.26px] h-[65.615px]')}>
            <div>
              <img src={splashRotated} alt="" className={cn('w-[65.615px] h-[118.26px]')} />
            </div>
          </div>

          {/* 중앙 로고 - Figma 디자인 기준: left-[908.13px] top-[425.31px] w-[100px] h-[23px] */}
          <div className={cn('flex items-center justify-center', 'w-[100px] h-[23px]', 'md:w-[140px] md:h-[32px]')}>
            <img src={splashLogo} alt="Valuedi" className={cn('w-full h-full object-contain')} />
          </div>
        </div>

        {/* 하단 텍스트 */}
        <Typography
          style="text-body-2-14-regular"
          className={cn(
            'absolute left-1/2 -translate-x-1/2',
            'bottom-[83px] md:bottom-[80px]',
            'w-[320px] text-center',
            'text-neutral-70'
          )}
          color="neutral-70"
        >
          똑똑한 금융서비스, 밸류디
        </Typography>
      </div>
    </div>
  );
};

export default SplashPage;
