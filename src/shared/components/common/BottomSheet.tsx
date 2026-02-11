import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40"
          />
          <div className="fixed bottom-0 left-0 right-0 z-[101] flex justify-center pointer-events-none">
            <div className="w-full max-w-[360px] pointer-events-auto">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative rounded-t-3xl bg-white px-8 pb-10 pt-12 shadow-2xl"
              >
                <div className="absolute left-1/2 top-4 h-1.5 w-12 -translate-x-1/2 rounded-full bg-gray-200" />
                {title && <h2 className="mb-8 text-2xl font-bold text-gray-900 font-pretendard">{title}</h2>}
                {children}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
