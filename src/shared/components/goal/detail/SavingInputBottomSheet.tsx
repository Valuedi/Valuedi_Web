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

const MIN_MAN = 1;
const MAX_MAN = 1000;

function formatWon(won: number) {
  return won.toLocaleString('ko-KR');
}

function clampMan(value: number) {
  return Math.min(MAX_MAN, Math.max(MIN_MAN, value));
}

const SavingInputBottomSheet = ({ isOpen, onClose, item, onConfirm }: SavingInputBottomSheetProps) => {
  const initialMan = useMemo(() => {
    if (!item?.amountWon) return MIN_MAN;
    const man = Math.round(item.amountWon / 10000);
    return Math.min(MAX_MAN, Math.max(MIN_MAN, man));
  }, [item]);

  const [man, setMan] = useState<number>(MIN_MAN);
  const [mode, setMode] = useState<'slider' | 'direct'>('slider');
  const [directValue, setDirectValue] = useState<string>(String(MIN_MAN));

  useEffect(() => {
    if (isOpen) {
      setMan(initialMan);
      setMode('slider');
      setDirectValue(String(initialMan));
    }
  }, [initialMan, isOpen]);

  const amountWon = man * 10000;
  const rangeFill = ((man - MIN_MAN) / (MAX_MAN - MIN_MAN)) * 100;

  if (!item) return null;

  const applyDirectValue = (next: string) => {
    const normalized = next.replace(/^0+(?=\d)/, '');
    const asNumber = Number(normalized || '0');
    const nextMan = clampMan(asNumber || MIN_MAN);
    setDirectValue(String(nextMan));
    setMan(nextMan);
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
        <span className="text-[18px] font-bold text-[#171714]">{man}만원</span>
      </div>

      {mode === 'slider' ? (
        <>
          {/* 슬라이더 */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 px-1">
            <span>1만원</span>
            <span>{MAX_MAN.toLocaleString('ko-KR')}만원</span>
          </div>

          <input
            type="range"
            min={MIN_MAN}
            max={MAX_MAN}
            step={1}
            value={man}
            onChange={(e) => {
              const nextMan = clampMan(Number(e.target.value));
              setMan(nextMan);
              setDirectValue(String(nextMan));
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
              { label: '+1만원', delta: 1 },
              { label: '+5만원', delta: 5 },
              { label: '+10만원', delta: 10 },
            ].map((x) => (
              <button
                key={x.label}
                type="button"
                onClick={() => {
                  const nextMan = clampMan(man + x.delta);
                  setMan(nextMan);
                  setDirectValue(String(nextMan));
                }}
                className="px-3 py-2 text-sm font-bold text-[#171714] bg-white border border-gray-200 rounded-full"
              >
                {x.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setMan(MAX_MAN);
                setDirectValue(String(MAX_MAN));
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
