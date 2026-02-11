import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { Toast } from './Toast';
import { PULL_TO_REFRESH_CONSTANTS, TOAST_MESSAGE } from './type/pullToRefresh.constants';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  cooldownMinutes?: number;
}

const PullToRefresh = ({ children, onRefresh, threshold = 80, cooldownMinutes = 10 }: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRefreshTime = useRef<number>(0);

  const handleStart = useCallback((clientY: number) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = clientY;
      isPulling.current = true;
    }
  }, []);

  const handleMove = useCallback(
    (clientY: number, preventDefault?: () => void) => {
      if (!isPulling.current || isRefreshing) return;

      const currentY = clientY;
      const distance = currentY - startY.current;

      if (distance > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
        const maxPullDistance = threshold * PULL_TO_REFRESH_CONSTANTS.MAX_PULL_MULTIPLIER;
        const adjustedDistance = distance * PULL_TO_REFRESH_CONSTANTS.FRICTION_COEFFICIENT;
        setPullDistance(Math.min(adjustedDistance, maxPullDistance));
        preventDefault?.();
      }
    },
    [isRefreshing, threshold]
  );

  const handleEnd = useCallback(async () => {
    if (!isPulling.current) return;

    isPulling.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTime.current;
      const cooldownMs = cooldownMinutes * PULL_TO_REFRESH_CONSTANTS.MINUTES_TO_MS;

      if (lastRefreshTime.current > 0 && timeSinceLastRefresh < cooldownMs) {
        console.log('[PullToRefresh] 쿨다운 중 - Toast 표시');
        setPullDistance(0);
        setShowToast(true);
        setTimeout(() => setShowToast(false), PULL_TO_REFRESH_CONSTANTS.TOAST_DURATION_MS);
        return;
      }

      setIsRefreshing(true);
      lastRefreshTime.current = now;
      try {
        await onRefresh();
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, PULL_TO_REFRESH_CONSTANTS.REFRESH_ANIMATION_DURATION_MS);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh, cooldownMinutes]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientY);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientY, () => e.preventDefault());
    },
    [handleMove]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientY);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientY, () => e.preventDefault());
    },
    [handleMove]
  );

  const gradientOpacity = Math.min(pullDistance / threshold, 1);
  const gradientHeight = isRefreshing ? threshold : pullDistance;
  const { r, g, b } = PULL_TO_REFRESH_CONSTANTS.GRADIENT_COLOR_RGB;
  const gradientAlpha = gradientOpacity * PULL_TO_REFRESH_CONSTANTS.GRADIENT_OPACITY_MULTIPLIER;

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none transition-all duration-300 ease-out z-10"
        style={{
          height: `${gradientHeight}px`,
          background: `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, ${gradientAlpha}), rgba(${r}, ${g}, ${b}, 0))`,
          opacity: gradientOpacity,
        }}
      />
      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        style={{
          transform: `translateY(${(isRefreshing ? threshold : pullDistance) / PULL_TO_REFRESH_CONSTANTS.TRANSFORM_DIVISOR}px)`,
          transition: isPulling.current
            ? 'none'
            : `transform ${PULL_TO_REFRESH_CONSTANTS.TRANSITION_DURATION_MS / 1000}s ease-out`,
          cursor: isPulling.current ? 'grabbing' : 'grab',
        }}
      >
        {children}
      </div>
      <Toast message={TOAST_MESSAGE} isOpen={showToast} />
    </div>
  );
};

export default PullToRefresh;
