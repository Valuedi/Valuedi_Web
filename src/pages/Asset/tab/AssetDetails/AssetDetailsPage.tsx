import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Typography } from '@/components';

import { AssetList } from './components/AssetList';
import { AssetLedger } from './components/AssetLedger';

export const AssetDetails = () => {
  const [viewType, setViewType] = useState<'list' | 'ledger'>('list');

  return (
    <div className={cn('flex flex-col w-full h-full bg-neutral-0 ')}>
      <div className={cn('px-[20px] pt-[20px]')}>
        <div className={cn('flex w-full p-[2px] rounded-[6px] bg-neutral-10')}>
          <button
            onClick={() => setViewType('list')}
            className={cn(
              'flex-1 flex items-center justify-center px-[12px] py-[4px] gap-[10px] rounded-[4px]',
              viewType === 'list' && 'bg-neutral-0 shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]'
            )}
          >
            <Typography
              style={viewType === 'list' ? 'text-caption-1-12-medium' : 'text-caption-1-12-regular'}
              className={`${viewType === 'list' ? 'text-neutral-90' : 'text-neutral-70'}`}
              fontFamily="pretendard"
            >
              자산목록
            </Typography>
          </button>

          <button
            onClick={() => setViewType('ledger')}
            className={cn(
              'flex-1 flex items-center justify-center px-[12px] py-[4px] gap-[10px] rounded-[4px]',
              viewType === 'ledger' && 'bg-neutral-0 shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]'
            )}
          >
            <Typography
              style={viewType === 'ledger' ? 'text-caption-1-12-medium' : 'text-caption-1-12-regular'}
              className={`${viewType === 'ledger' ? 'text-neutral-90' : 'text-neutral-70'}`}
              fontFamily="pretendard"
            >
              가계부
            </Typography>
          </button>
        </div>
      </div>

      <div className={cn('flex-1')}>{viewType === 'list' ? <AssetList /> : <AssetLedger />}</div>
    </div>
  );
};
