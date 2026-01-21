import React from 'react';
import { cn } from '@/utils/cn';
import { Typography } from '@/components/typography';
import ListIcon from '@/assets/icons/List.svg?react';
import CalendarIcon from '@/assets/icons/Calendar.svg?react';

export type ViewMode = 'list' | 'calendar';

export interface ViewToggleButtonProps {
  className?: string;
  leftText?: string;
  rightText?: string;
  mode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

const ViewToggleButton: React.FC<ViewToggleButtonProps> = ({ className, leftText, rightText, mode, onToggle }) => {
  return (
    <div
      className={cn(
        'flex items-center',
        'gap-[4px]',
        'p-[4px]',
        'bg-neutral-20',
        'rounded-[6px]',
        'w-fit h-fit',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onToggle('list')}
        className={cn(
          'flex items-center justify-center',
          'h-[24px]',
          'gap-[10px]',
          'px-[8px] py-[10px]',
          'rounded-[4px]',
          mode === 'list' ? 'bg-neutral-0 text-neutral-90' : 'bg-neutral-20 text-neutral-50'
        )}
      >
        <ListIcon className="fill-current" />

        {leftText && (
          <Typography
            style="text-body-2-14-regular"
            className={cn(mode === 'list' ? 'text-neutral-90' : 'text-neutral-70')}
          >
            {leftText}
          </Typography>
        )}
      </button>

      <button
        type="button"
        onClick={() => onToggle('calendar')}
        className={cn(
          'flex items-center justify-center',
          'h-[24px]',
          'gap-[10px]',
          'px-[8px] py-[10px]',
          'rounded-[4px]',
          mode === 'calendar' ? 'bg-neutral-0 text-neutral-90' : 'bg-neutral-20 text-neutral-50'
        )}
      >
        <CalendarIcon className="stroke-current" />

        {rightText && (
          <Typography
            style="text-body-2-14-regular"
            className={cn(mode === 'calendar' ? 'text-neutral-90' : 'text-neutral-70')}
          >
            {rightText}
          </Typography>
        )}
      </button>
    </div>
  );
};

export default ViewToggleButton;
