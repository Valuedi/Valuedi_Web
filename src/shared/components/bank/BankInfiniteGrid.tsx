import BankCard from '@/shared/components/bank/BankCard';
import { Bank } from '@/features/bank/constants/banks';

interface BankInfiniteGridProps {
  availableBanks: Bank[];
}

const BankInfiniteGrid = ({ availableBanks }: BankInfiniteGridProps) => {
  const banksPerRow = 5;
  const fixedRows = 3;
  const cardWidth = 71 + 12;

  const createInfiniteBanks = (startIndex: number) => {
    const banks = [];
    for (let i = 0; i < banksPerRow * 4; i++) {
      const bankIndex = (startIndex + i) % availableBanks.length;
      banks.push(availableBanks[bankIndex]);
    }
    return banks;
  };

  return (
    <div className="flex flex-col gap-[12px] px-[20px] py-[20px] mt-[20px] pb-[120px] items-center overflow-hidden">
      <style>
        {`
            @keyframes scroll-smooth-step {
            0% { transform: translateX(-${cardWidth * banksPerRow}px); }
            5%, 20% { transform: translateX(-${cardWidth * (banksPerRow - 1)}px); }
            25%, 40% { transform: translateX(-${cardWidth * (banksPerRow - 2)}px); }
            45%, 60% { transform: translateX(-${cardWidth * (banksPerRow - 3)}px); }
            65%, 80% { transform: translateX(-${cardWidth * (banksPerRow - 4)}px); }
            85%, 100% { transform: translateX(0px); }
            }

            .infinite-scroll-row {
              animation: scroll-smooth-step 15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              will-change: transform; /* 성능 최적화 추가 */
            }

            .infinite-scroll-row:hover {
              animation-play-state: paused;
            }
        `}
      </style>
      {Array.from({ length: fixedRows }).map((_, rowIndex) => {
        const startIndex = rowIndex * banksPerRow;
        const rowBanks = createInfiniteBanks(startIndex);

        let animationDelay = 0;

        let rowOffset = 0;

        if (rowIndex === 1) {
          rowOffset = -(cardWidth / 2);
          animationDelay = 0.1;
        }

        return (
          <div key={rowIndex} className="flex gap-[12px] items-center w-full relative justify-center">
            <div
              className="flex gap-[12px] items-center infinite-scroll-row"
              style={{
                animationDelay: `${animationDelay}s`,
                width: `${cardWidth * banksPerRow * 4}px`,
                marginLeft: `${rowOffset}px`,
              }}
            >
              {rowBanks.map((bank, index) => (
                <div key={`${bank.id}-${rowIndex}-${index}`} className="flex-shrink-0">
                  <BankCard bankName={bank.name} bankIcon={bank.icon} isSelected={false} onClick={() => {}} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BankInfiniteGrid;
