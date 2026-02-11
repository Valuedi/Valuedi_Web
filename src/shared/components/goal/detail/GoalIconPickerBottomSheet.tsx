import { useEffect, useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/common/BottomSheet';
import { BaseButton } from '@/shared/components/buttons/BaseButton';

function basenameNoExt(filePath: string) {
  const last = filePath.split('/').pop() ?? filePath;
  return last.replace(/\.svg$/i, '');
}

const colorModules = import.meta.glob('/src/assets/icons/goal/color/*.svg', { eager: true, import: 'default' });
const selectedColorModules = import.meta.glob('/src/assets/icons/goal/selected-color/*.svg', {
  eager: true,
  import: 'default',
});
const iconModules = import.meta.glob('/src/assets/icons/goal/icon/*.svg', { eager: true, import: 'default' });

const COLOR_ORDER = [
  'Red',
  'RedOrange',
  'Orange',
  'yellow',
  'Lime',
  'Green',
  'Cyan',
  'LightBlue',
  'Blue',
  'Violet',
  'Purple',
  'Pink',
] as const;

export const ICON_ORDER = [
  'Date',
  'Interest',
  'Interest2',
  'Book',
  'Goal',
  'Game',
  'Travle',
  'Meal',
  'Shopping',
  'Home',
  'Saving',
] as const;

const COLOR_TO_SELECTED: Record<string, string> = {
  Red: 'SelectedRed',
  Orange: 'SelectedOrange',
  RedOrange: 'SelectedRedOrange',
  yellow: 'SelectedYellow',
  Lime: 'SelectedLime',
  Green: 'SelectedGreen',
  Cyan: 'SelectedCyan',
  LightBlue: 'SelectedLightblue',
  Blue: 'SelectedBlue',
  Violet: 'SelectedViolet',
  Purple: 'SelectedPurple',
  Pink: 'SelectedPink',
};

function orderIndex(name: string, order: readonly string[]) {
  const idx = order.indexOf(name);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

const selectedColorMap = Object.entries(selectedColorModules).reduce(
  (acc, [path, src]) => {
    const name = basenameNoExt(path);
    acc[name] = src as string;
    return acc;
  },
  {} as Record<string, string>
);

const colorOptions = Object.entries(colorModules)
  .map(([path, src]) => {
    const name = basenameNoExt(path);
    const selectedName = COLOR_TO_SELECTED[name];
    const selectedSrc = selectedName ? selectedColorMap[selectedName] : undefined;
    return { id: path, src: src as string, selectedSrc, name };
  })
  .sort((a, b) => orderIndex(a.name, COLOR_ORDER) - orderIndex(b.name, COLOR_ORDER));

const iconOptions = Object.entries(iconModules)
  .map(([path, src]) => ({ id: path, src: src as string, name: basenameNoExt(path) }))
  .sort((a, b) => orderIndex(a.name, ICON_ORDER) - orderIndex(b.name, ICON_ORDER));

interface GoalIconPickerBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (payload: { colorId: string; iconId: string }) => void;
  initialColorId?: string;
  initialIconId?: string;
}

const GoalIconPickerBottomSheet = ({
  isOpen,
  onClose,
  onConfirm,
  initialColorId,
  initialIconId,
}: GoalIconPickerBottomSheetProps) => {
  const fallbackColorId = useMemo(() => colorOptions[0]?.id ?? '', []);
  const fallbackIconId = useMemo(() => iconOptions[0]?.id ?? '', []);

  const [selectedColorId, setSelectedColorId] = useState<string>(initialColorId ?? fallbackColorId);
  const [selectedIconId, setSelectedIconId] = useState<string>(initialIconId ?? fallbackIconId);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedColorId(initialColorId ?? fallbackColorId);
    setSelectedIconId(initialIconId ?? fallbackIconId);
  }, [fallbackColorId, fallbackIconId, initialColorId, initialIconId, isOpen]);

  const handleConfirm = () => {
    onConfirm?.({ colorId: selectedColorId, iconId: selectedIconId });
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 text-sm font-semibold text-[#171714]">목표 아이콘 지정</div>

      <div className="mb-4 text-xs font-semibold text-gray-600">색상</div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {colorOptions.map((c) => {
          const isSelected = selectedColorId === c.id;
          const imgSrc = isSelected && c.selectedSrc ? c.selectedSrc : c.src;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedColorId(c.id)}
              className="rounded-2xl flex items-center justify-center flex-shrink-0 p-0"
            >
              <img src={imgSrc} alt="color" className="w-11 h-11" />
            </button>
          );
        })}
      </div>

      <div className="mt-6 mb-4 text-xs font-semibold text-gray-600">아이콘</div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {iconOptions.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => setSelectedIconId(i.id)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              selectedIconId === i.id ? 'bg-gray-500' : 'bg-gray-200'
            }`}
          >
            <img src={i.src} alt="icon" />
          </button>
        ))}
      </div>

      <div className="mt-8">
        <BaseButton
          size="large"
          variant="primary"
          text="확인하기"
          onClick={handleConfirm}
          fullWidth
          typographyStyle="text-body-1-16-semi-bold"
          className="bg-primary-normal"
        />
      </div>
    </BottomSheet>
  );
};

export default GoalIconPickerBottomSheet;
