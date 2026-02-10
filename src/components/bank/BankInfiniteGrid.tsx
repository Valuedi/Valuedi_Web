import BankCard from '@/components/bank/BankCard';
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
    for (let i = 0; i < banksPerRow * 2; i++) {
      const bankIndex = (startIndex + i) % availableBanks.length;
      banks.push(availableBanks[bankIndex]);
    }
    return banks;
  };

  return (
    <div className="flex flex-col gap-[12px] px-[20px] py-[20px] mt-[20px] pb-[120px]">
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${cardWidth * banksPerRow}px); }
          }
          .infinite-scroll-row {
            animation: scroll-left ${fixedRows * 12}s linear infinite;
          }
          .infinite-scroll-row:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {Array.from({ length: fixedRows }).map((_, rowIndex) => {
        const startIndex = rowIndex * banksPerRow;
        const rowBanks = createInfiniteBanks(startIndex);
        const animationDelay = rowIndex * 4;

        return (
          <div key={rowIndex} className="flex gap-[12px] items-center overflow-hidden w-full relative">
            <div
              className="flex gap-[12px] items-center infinite-scroll-row"
              style={{
                animationDelay: `${animationDelay}s`,
                width: `${cardWidth * banksPerRow * 2}px`,
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
