import { ChangeEvent, FocusEvent, ReactNode, useState } from 'react';
import { cn } from '@/utils/cn';
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
    if (isFocused) return 'border-text-title';
    return 'border-neutral-40';
  };

  const getBgClass = () => {
    if ((isGrayBg || readOnly) && !isFocused) return 'bg-neutral-20';
    return 'bg-white';
  };

  const hasRightArea = width === 'withButton' || !!rightElement || !!timer;

  const inputWidthClass =
    width === 'full'
      ? 'w-[20rem]'
      : width === 'withButton'
        ? 'w-[14.5rem]'
        : typeof width === 'string'
          ? `w-[${width}]`
          : 'w-[20rem]';

  return (
    <div className={cn('inline-flex flex-col text-left transition-all py-4', className)}>
      {label && (
        <div className="mb-2">
          <Typography variant="body-2" weight="semi-bold" className="text-text-body">
            {label}
          </Typography>
        </div>
      )}

      <div className="flex items-center gap-2 h-[48px]">
        <div className="relative h-full">
          <input
            name={name}
            type={type}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={(e) => {
              if (readOnly) return;
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={() => setIsFocused(false)}
            readOnly={readOnly}
            className={cn(
              'h-full px-[12px] border rounded-[8px] outline-none transition-all text-[14px] font-pretendard',
              'placeholder:text-neutral-40',
              getBgClass(),
              getBorderClass(),
              readOnly && 'cursor-not-allowed opacity-70',
              inputWidthClass,
              hasRightArea && 'pr-[4.5rem]'
            )}
          />

          {timer && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <Typography variant="caption-2" className="text-neutral-60">
                {timer}
              </Typography>
            </div>
          )}
        </div>

        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>

      {error || success ? (
        <div className="h-[24px] mt-1 flex items-center">
          <Typography
            variant="caption-2"
            weight="medium"
            className={cn('ml-2', error ? 'text-status-error' : 'text-status-abled')}
          >
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
