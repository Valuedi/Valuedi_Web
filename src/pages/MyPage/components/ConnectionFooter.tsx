import { Typography } from '@/shared/components/typography';
import BottomSheet from '@/shared/components/common/BottomSheet';
import { useState } from 'react';

interface ConnectionFooterProps {
  onDelete: () => void;
}

export const ConnectionFooter = ({ onDelete }: ConnectionFooterProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDisconnect = () => {
    // 💡 1. 부모의 삭제 로직 실행 (토스트 노출 및 데이터 삭제)
    onDelete();
    // 💡 2. 모달 닫기
    handleCloseModal();
  };
  return (
    <footer className="px-5 py-5">
      {/* 💡 유의사항 박스 */}
      <div className="bg-neutral-10 p-4 rounded-xl mb-6">
        <Typography variant="body-3" className="text-neutral-50">
          연결 은행을 해제하더라도 기존 자산과 거래 내역은 그대로 남아있습니다. 단, 계약 및 서비스 이용 기록은 관련
          법령에 따라 해제일 기준 5년간 보관됩니다. 불만 및 분쟁 처리 기록은 해제일 기준 3년간 보관됩니다.
        </Typography>
      </div>

      {/* 💡 해제 버튼 */}
      <button
        className="w-full py-4 bg-neutral-30 text-neutral-70 rounded-xl font-semibold active:bg-neutral-20 transition-colors"
        onClick={handleOpenModal}
      >
        연결 해제
      </button>
      <BottomSheet isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col">
          {/* 타이틀: 디자인 토큰 headline-1 또는 headline-3 활용 */}
          <Typography variant="body-1" weight="semi-bold" className="mb-4 text-neutral-90">
            연결을 해제하시겠어요?
          </Typography>

          {/* 설명 문구: 시안 내용 반영 */}
          <Typography variant="body-3" className="text-neutral-50 mb-5">
            계좌 연결을 해제하더라도 기존 자산과 거래 내역은 그대로 남아 있습니다. 다만 자동 업데이트는 중단되며, 해당
            계좌에 연결된 목표는 삭제됩니다.
          </Typography>

          {/* 최종 해제 버튼 */}
          <button
            onClick={handleDisconnect}
            className="w-full py-4 bg-neutral-30 text-neutral-70 rounded-xl font-semibold active:bg-neutral-20 transition-colors"
          >
            해제하기
          </button>
        </div>
      </BottomSheet>
    </footer>
  );
};
