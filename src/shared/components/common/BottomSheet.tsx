import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const modalVariants = {
  initial: { y: '100%', opacity: 0, scale: 1 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      damping: 25, // 반동 억제력
      stiffness: 280, // 강성
      mass: 0.8, // 무게
    },
  },
  exit: {
    y: '100%',
    opacity: 0.5,
    transition: {
      type: 'tween' as const,
      ease: 'easeInOut' as const,
      duration: 0.25,
    },
  },
} as const;

const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/10"
          />

          {/* 2. 컨테이너 */}
          <div className="fixed inset-0 z-[101] flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              /* sm 이상(데스크탑)에서는 '위아래' 대신 '페이드/확대' 모션으로 덮어쓰기 */
              className="
                pointer-events-auto relative w-full bg-white shadow-2xl
                rounded-t-[2rem] px-6 pb-10 pt-12
                sm:max-w-[500px] sm:rounded-3xl sm:p-8
                /* 데스크탑에서 애니메이션 스타일 변경 (Tailwind 미디어 쿼리 연동은 어려우므로 필요한 경우 variant 추가 분기) */
              "
            >
              <div className="absolute left-1/2 top-4 h-1.5 w-12 -translate-x-1/2 rounded-full bg-gray-200 sm:hidden" />

              <button
                onClick={onClose}
                className="absolute right-6 top-6 hidden text-gray-400 hover:text-gray-600 sm:block transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {title && <h2 className="mb-6 text-xl font-bold text-gray-900 font-pretendard sm:text-2xl">{title}</h2>}

              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
