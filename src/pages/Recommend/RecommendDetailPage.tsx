import { useNavigate, useParams } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { BANNER } from '@/features/recommend/constants/banner';
import { BGBANKS } from '@/features/bank/constants/bgbanks';
import { getColorToken } from '@/shared/styles/design-system';
import { InterestCalculator } from './components/InterestCalculator';
import { InterestRateList, InterestRateItem } from './components/InterestRateList';
import { ProductInfoList, ProductInfoItem } from './components/ProductInfoList';
import { LoginButton } from '@/shared/components/buttons';
import { useSavingsDetail } from '@/features/recommend/recommend.hooks';
import { useMemo } from 'react';

export const RecommendDetailPage = () => {
  const navigate = useNavigate();
  const { id: finPrdtCd } = useParams<{ id: string }>();

  const { data: detailData, isLoading, isError } = useSavingsDetail(finPrdtCd);

  const product = detailData;

  // 은행명 정규화 함수
  const normalizeBankName = (name: string): string => {
    return name
      .replace(/주식회사\s*/g, '')
      .replace(/\(주\)\s*/g, '')
      .replace(/\s*은행\s*/g, '')
      .replace(/\s+/g, '')
      .trim();
  };

  // 은행명 매칭 함수
  const matchBankName = (bankName: string, targetName: string): boolean => {
    const normalizedBank = normalizeBankName(bankName);
    const normalizedTarget = normalizeBankName(targetName);

    // 정규화된 이름으로 매칭
    if (
      normalizedBank === normalizedTarget ||
      normalizedBank.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedBank)
    ) {
      return true;
    }

    // 특수 케이스: 케이뱅크 <-> K뱅크
    if (normalizedBank.includes('케이뱅크') && normalizedTarget === 'K뱅크') {
      return true;
    }
    if (normalizedBank === 'K뱅크' && normalizedTarget.includes('케이뱅크')) {
      return true;
    }

    // 원본 이름으로도 매칭 시도
    return bankName.includes(targetName) || targetName.includes(bankName);
  };

  // 은행명으로 아이콘/색상 매핑
  const { targetBank, iconSrc } = useMemo<{
    targetBank: (typeof BANNER)[number] | null;
    iconSrc: string | null;
  }>(() => {
    if (!product) {
      return { targetBank: null, iconSrc: null };
    }
    // 1차: 추천 배너용 매핑 (색상 포함)
    const bannerBank = BANNER.find((bank) => matchBankName(product.korCoNm, bank.name));
    // 2차: 배경 은행 아이콘 매핑 (아이콘만)
    const bgBank = BGBANKS.find((bank) => matchBankName(product.korCoNm, bank.name));

    const icon = bannerBank?.icon ?? bgBank?.icon;

    return { targetBank: bannerBank ?? null, iconSrc: icon ?? null };
  }, [product]);

  const backgroundColor = targetBank ? getColorToken(targetBank.color) : getColorToken('neutral-10');

  // API 데이터를 컴포넌트에 맞는 형식으로 변환
  const preferentialRates: InterestRateItem[] = useMemo(() => {
    if (!product?.options) return [];
    return product.options.map((option) => ({
      description: `${option.rsrvTypeNm} | ${option.saveTrm}개월 | ${option.intrRateTypeNm}`,
      rate: option.intrRate2, // 우대금리
    }));
  }, [product]);

  const productDetailInfo: ProductInfoItem[] = useMemo(() => {
    if (!product) return [];
    return [
      {
        label: '가입방법',
        value: product.joinWay,
      },
      {
        label: '가입대상',
        value: product.joinMember,
      },
      {
        label: '최대한도',
        value: product.maxLimit ? `${Number(product.maxLimit).toLocaleString()}원` : undefined,
      },
      {
        label: '만기 후 이자율',
        value: product.mtrtInt,
      },
      {
        label: '우대조건',
        value: product.spclCnd,
      },
      {
        label: '가입제한',
        value: product.joinDeny === '1' ? '제한있음' : '제한없음',
      },
      {
        label: '유의사항',
        value: product.etcNote,
      },
    ].filter((item) => item.value); // 값이 있는 것만 필터링
  }, [product]);

  // 최고 금리와 기본 금리 - API에서 직접 제공되면 사용, 없으면 options에서 계산
  const maxRate = useMemo(() => {
    if (product?.maxRate !== undefined) return product.maxRate;
    if (!product?.options || product.options.length === 0) return 0;
    return Math.max(...product.options.map((opt) => opt.intrRate2));
  }, [product]);

  const basicRate = useMemo(() => {
    if (product?.basicRate !== undefined) return product.basicRate;
    if (!product?.options || product.options.length === 0) return 0;
    // 가장 긴 기간의 기본 금리 사용 (일반적으로 가장 긴 기간이 기본)
    const sortedOptions = [...product.options].sort((a, b) => Number(b.saveTrm) - Number(a.saveTrm));
    return sortedOptions[0]?.intrRate || 0;
  }, [product]);

  const recommendationNotice = useMemo(
    () => [
      '제공되는 정보는 금융감독원 23.06.15일 공시된 내용 기반으로 작성되었으며, 금융상품 광고가 아닙니다.',
      '실제 상품 가입 시점에 변동될 수 있으므로 상품 가입 시 꼭 다시 확인하시기 바랍니다.',
    ],
    []
  );

  const recommendationBulletNotices = useMemo(
    () => [
      '본 페이지는 밸류디에서 대가 관계 없이 정보제공 목적으로 자체 제작한 게시물입니다.',
      '밸류디는 최신 정보 업데이트에 최선을 다하고 있습니다.',
      '해당 금융사 홈페이지 등에서 상품 정보와 이용 조건을 확인하고 신청하시길 바랍니다.',
    ],
    []
  );

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <MobileLayout className="bg-white">
        <div className={cn('sticky top-0 z-10 w-full')}>
          <BackPageGNB
            className={cn('bg-neutral-0')}
            text=""
            titleColor="text-neutral-90"
            title="추천"
            onBack={handleBack}
          />
        </div>
        <div className={cn('flex items-center justify-center py-[40px]')}>
          <Typography style="text-body-2-14-regular" className="text-neutral-70">
            상품 정보를 불러오는 중...
          </Typography>
        </div>
      </MobileLayout>
    );
  }

  if (isError || !product) {
    return (
      <MobileLayout className="bg-white">
        <div className={cn('sticky top-0 z-10 w-full')}>
          <BackPageGNB
            className={cn('bg-neutral-0')}
            text=""
            titleColor="text-neutral-90"
            title="추천"
            onBack={handleBack}
          />
        </div>
        <div className={cn('flex items-center justify-center py-[40px]')}>
          <Typography style="text-body-2-14-regular" className="text-neutral-70">
            상품 정보를 불러오는데 실패했습니다.
          </Typography>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout className="bg-white">
      <div className={cn('sticky top-0 z-10 w-full')}>
        <BackPageGNB
          className={cn('bg-neutral-0')}
          text=""
          titleColor="text-neutral-90"
          title="추천"
          onBack={handleBack}
        />
      </div>

      <div className={cn('flex flex-col gap-[20px] px-[20px] ')}>
        <div className={cn('flex flex-col gap-[12px] py-[20px]')}>
          <div
            style={{ backgroundColor: backgroundColor }}
            className={cn('w-[32px] h-[32px] flex items-center justify-center rounded-[8px]')}
          >
            {iconSrc ? (
              <img src={iconSrc} alt={product.korCoNm} className={cn('w-[18px] h-[18px] object-cover')} />
            ) : null}
          </div>

          <div className={cn('flex flex-col gap-[4px]')}>
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
              {product.korCoNm}
            </Typography>

            <Typography style="text-headline-1-22-semi-bold" className={cn('text-neutral-90')}>
              {product.finPrdtNm}
            </Typography>
          </div>
        </div>
        <div className={cn('flex flex-col gap-[8px]')}>
          <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
            우대조건
          </Typography>

          <div className={cn('flex flex-col gap-[8px] px-[12px] py-[16px] rounded-[8px] bg-neutral-10')}>
            <div className={cn('flex justify-between items-center')}>
              <Typography style="text-body-2-14-regular" className={cn('text-neutral-90')}>
                최고 금리
              </Typography>
              <div className={cn('flex gap-[2px]')}>
                <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                  {maxRate.toFixed(2)}
                </Typography>
                <Typography style="text-body-2-14-regular" className={cn('text-neutral-90')}>
                  %
                </Typography>
              </div>
            </div>

            {basicRate > 0 && (
              <div className={cn('flex justify-between items-center')}>
                <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
                  기본 금리
                </Typography>
                <div className={cn('flex gap-[2px]')}>
                  <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                    {basicRate.toFixed(2)}
                  </Typography>
                  <Typography style="text-body-2-14-regular" className={cn('text-neutral-90')}>
                    %
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={cn('h-[8px] bg-neutral-10 mx-[-20px]')} />

        <InterestCalculator basicRate={basicRate} maxRate={maxRate} />

        {preferentialRates.length > 0 && <InterestRateList items={preferentialRates} />}

        <div className={cn('h-[8px] bg-neutral-10 mx-[-20px]')} />

        {productDetailInfo.length > 0 && <ProductInfoList items={productDetailInfo} initialCount={3} />}

        <div className={cn('flex flex-col gap-[8px] rounded-[8px]')}>
          <div className={cn('flex flex-col gap-[4px]')}>
            {recommendationNotice.map((notice) => (
              <Typography
                key={notice}
                style="text-caption-1-12-regular"
                className={cn('text-neutral-50 break-keep break-words')}
              >
                {notice}
              </Typography>
            ))}
          </div>

          <ul className={cn('flex flex-col gap-[4px]')}>
            {recommendationBulletNotices.map((notice) => (
              <li key={notice} className={cn('flex items-start gap-[4px]')}>
                <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
                  •
                </Typography>
                <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50 break-keep break-words')}>
                  {notice}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={cn('px-[20px] pb-[20px] mt-[47px]')}>
        <LoginButton text="신청하기" className={cn('w-full')} />
      </div>
    </MobileLayout>
  );
};

export default RecommendDetailPage;
