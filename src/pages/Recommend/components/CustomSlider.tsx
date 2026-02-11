import { cn } from '@/shared/utils/cn';

interface CustomSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export const CustomSlider = ({ min, max, step, value, onChange }: CustomSliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('relative flex items-center w-full h-[16px]')}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn('absolute w-full h-full opacity-0 z-10 cursor-pointer')}
      />

      <div className={cn('w-full h-[8px] bg-neutral-10 rounded-full')}>
        <div className={cn('h-full bg-primary-normal rounded-full')} style={{ width: `${percentage}%` }} />
      </div>

      <div
        className={cn(
          'absolute h-[16px] w-[16px]',
          'bg-neutral-10 border border-neutral-90',
          'rounded-full shadow-sm pointer-events-none'
        )}
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
};
