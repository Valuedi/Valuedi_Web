import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import BottomSheet from '@/shared/components/common/BottomSheet';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
export interface SavingCategoryItem {
  id: number;
  title: string;
  icon: string;
  amountWon?: number;
}

interface SavingInputBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: SavingCategoryItem | null;
  onConfirm: (id: number, amountWon: number) => void;
}

// 최소/최대 금액 (원 단위)
const MIN_AMOUNT = 0;
const MAX_AMOUNT = 1000 * 10_000; // 0원 ~ 1,000만원

function formatWon(won: number) {
  return won.toLocaleString('ko-KR');
}

function clampAmount(value: number) {
  return Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, value));
}

const SavingInputBottomSheet = ({ isOpen, onClose, item, onConfirm }: SavingInputBottomSheetProps) => {
  // 최초 금액: 기존 amountWon이 있으면 그대로, 없으면 0원
  const initialAmount = useMemo(() => {
    if (!item?.amountWon) return MIN_AMOUNT;
    return clampAmount(item.amountWon);
  }, [item]);

  // 내부 상태는 항상 "원 단위" 금액으로 관리
  const [amount, setAmount] = useState<number>(MIN_AMOUNT);
  const [mode, setMode] = useState<'slider' | 'direct'>('slider');
  const [directValue, setDirectValue] = useState<string>(String(initialAmount));

  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount);
      setMode('slider');
      setDirectValue(String(initialAmount));
    }
  }, [initialAmount, isOpen]);

  const amountWon = amount;
  const rangeFill = ((amountWon - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;

  if (!item) return null;

  const applyDirectValue = (next: string) => {
    const normalized = next.replace(/^0+(?=\d)/, '');
    const asNumber = Number(normalized || '0');
    const nextAmount = clampAmount(asNumber || 0);
    setDirectValue(String(nextAmount));
    setAmount(nextAmount);
  };

  const handleDigit = (digit: number) => {
    const next = directValue === '0' ? String(digit) : `${directValue}${digit}`;
    applyDirectValue(next);
  };

  const handleBackspace = () => {
    const next = directValue.length <= 1 ? '0' : directValue.slice(0, -1);
    applyDirectValue(next);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 text-[20px] font-bold text-[#171714]">카테고리</div>
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/70 flex items-center justify-center flex-shrink-0">
            <img src={item.icon} alt={item.title} className="w-6 h-6" />
          </div>
          <span className="text-[18px] font-bold text-[#171714]">{item.title}</span>
        </div>
        <span className="text-[18px] font-bold text-[#171714]">{formatWon(amountWon)}원</span>
      </div>

      {mode === 'slider' ? (
        <>
          {/* 슬라이더 */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 px-1">
            <span>0원</span>
            <span>{formatWon(MAX_AMOUNT)}원</span>
          </div>

          <input
            type="range"
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={10_000} // 슬라이더는 1만원 단위로 이동
            value={amount}
            onChange={(e) => {
              const nextAmount = clampAmount(Number(e.target.value));
              setAmount(nextAmount);
              setDirectValue(String(nextAmount));
            }}
            className="saving-range"
            style={{ ['--range-fill' as unknown as string]: `${rangeFill}%` } as CSSProperties}
          />
          <button
            type="button"
            className="w-full text-center text-gray-300 mt-8 mb-4"
            onClick={() => setMode('direct')}
          >
            직접 입력하기
          </button>
        </>
      ) : (
        <>
          {/* 빠른 추가 */}
          <div className="flex items-center gap-2 mb-5">
            {[
              { label: '+1만원', delta: 10_000 },
              { label: '+5만원', delta: 50_000 },
              { label: '+10만원', delta: 100_000 },
            ].map((x) => (
              <button
                key={x.label}
                type="button"
                onClick={() => {
                  const nextAmount = clampAmount(amount + x.delta);
                  setAmount(nextAmount);
                  setDirectValue(String(nextAmount));
                }}
                className="px-3 py-2 text-sm font-bold text-[#171714] bg-white border border-gray-200 rounded-full"
              >
                {x.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setAmount(MAX_AMOUNT);
                setDirectValue(String(MAX_AMOUNT));
              }}
              className="ml-auto px-3 py-2 text-sm font-bold text-[#171714] bg-white border border-gray-200 rounded-full"
            >
              전액
            </button>
          </div>

          {/* 키패드 */}
          <div className="grid grid-cols-3 gap-y-4 text-center text-[18px] font-bold text-[#171714] select-none">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} type="button" onClick={() => handleDigit(n)} className="py-2">
                {n}
              </button>
            ))}
            <div />
            <button type="button" onClick={() => handleDigit(0)} className="py-2">
              0
            </button>
            <button type="button" onClick={handleBackspace} className="py-2">
              ←
            </button>
          </div>

          <button
            type="button"
            className="w-full text-center text-gray-300 font-bold mt-8 mb-4"
            onClick={() => setMode('slider')}
          >
            슬라이더로 조절하기
          </button>
        </>
      )}

      <BaseButton
        size="large"
        variant="primary"
        text="입력하기"
        onClick={() => onConfirm(item.id, amountWon)}
        fullWidth
        typographyStyle="text-body-1-16-semi-bold"
        className="bg-primary-normal"
      />

      <div className="mt-3 text-center text-xs text-gray-300">{formatWon(amountWon)}원</div>
    </BottomSheet>
  );
};

export default SavingInputBottomSheet;
