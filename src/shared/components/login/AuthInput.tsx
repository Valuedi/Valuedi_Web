import { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

interface AuthInputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
  value: string;
  name: string;
  error?: string;
  success?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  focusBorderClassName?: string;
  rightElement?: ReactNode;
  timer?: string;
  className?: string;
  width?: 'full' | 'withButton' | string;
  isGrayBg?: boolean;
  isDouble?: boolean;
  readOnly?: boolean;
}

const AuthInput = ({
  label,
  placeholder,
  type = 'text',
  value,
  name,
  error,
  success,
  onChange,
  onFocus,
  onKeyDown,
  focusBorderClassName,
  rightElement,
  timer,
  className,
  width = 'full',
  isGrayBg,
  isDouble,
  readOnly,
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderClass = () => {
    if (error) return 'border-status-error';
    if (isFocused) return focusBorderClassName || 'border-text-title';
    return 'border-neutral-40';
  };

  const getBgClass = () => {
    if ((isGrayBg || readOnly) && !isFocused) return 'bg-neutral-20';
    return 'bg-white';
  };

  const resolvedWidth = (() => {
    if (width === 'full') return '320px';
    if (width === 'withButton') return '232px';
    if (width) return width;
    return '320px';
  })();

  return (
    <div className={cn('flex flex-col text-left justify-start transition-all w-[320px] mx-auto', className)}>
      {label && (
        <div className="h-[28px] flex items-start">
          <Typography variant="body-2" weight="semi-bold" className="text-text-body">
            {label}
          </Typography>
        </div>
      )}

      <div className="flex items-center gap-2 h-[48px]">
        <div
          className="relative h-full"
          style={{ width: rightElement ? undefined : resolvedWidth, flex: rightElement ? 1 : undefined }}
        >
          <input
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={(e) => {
              if (readOnly) return;
              setIsFocused(true);
              onFocus?.(e);
            }}
            onKeyDown={onKeyDown}
            onBlur={() => setIsFocused(false)}
            readOnly={readOnly}
            className={cn(
              'h-full w-full px-[12px] border rounded-[8px] outline-none transition-all text-[14px] font-pretendard',
              'placeholder:text-text-body',
              getBgClass(),
              getBorderClass(),
              readOnly && 'cursor-not-allowed opacity-70',
              timer && 'pr-[60px]'
            )}
          />
          {timer && (
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <Typography variant="caption-2" weight="medium" className="text-text-body">
                {timer}
              </Typography>
            </div>
          )}
        </div>

        {rightElement && <div className="flex items-center gap-2 flex-shrink-0">{rightElement}</div>}
      </div>

      {error || success ? (
        <div className="my-1.5 ml-2 flex items-start">
          <Typography variant="caption-2" weight="medium" className={error ? 'text-status-error' : 'text-status-abled'}>
            {error || success}
          </Typography>
        </div>
      ) : (
        <div className={cn(isDouble ? 'h-[8px]' : 'h-[24px]')} />
      )}
    </div>
  );
};

export default AuthInput;
