interface GoalLinkedAccountHeaderProps {
  bankIcon: string;
}

const GoalLinkedAccountHeader = ({ bankIcon }: GoalLinkedAccountHeaderProps) => (
  <div className="flex items-center gap-3 px-1 mb-2">
    <div className="flex items-center justify-center w-[48px] h-[48px] flex-shrink-0">
      <img src={bankIcon} alt="bank icon" className="w- h-9" />
    </div>

    <div className="text-sm text-gray-500 font-semibold whitespace-nowrap">하나카드 | 1213190120-42-12233</div>
  </div>
);

export default GoalLinkedAccountHeader;
