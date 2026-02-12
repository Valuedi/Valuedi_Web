# 디자인 시스템

이 디렉토리에는 프로젝트의 디자인 토큰과 스타일 시스템이 포함되어 있습니다.

## 파일 구조

- `design-tokens.css`: CSS 변수로 정의된 모든 디자인 토큰
- `globals.css`: 전역 스타일
- `design-system.ts`: TypeScript 타입 정의

## 사용 방법

### 1. 색상 사용

#### Tailwind 클래스 사용 (권장)

```tsx
<div className="bg-primary text-text-title">
  Primary 색상 배경
</div>

<div className="bg-neutral-50 text-neutral-90">
  Neutral 색상
</div>

<div className="bg-atomic-blue-50 text-atomic-blue-90">
  Atomic Blue 색상
</div>
```

#### CSS 변수 직접 사용

```tsx
<div style={{ backgroundColor: 'var(--color-pri-normal)' }}>Primary 색상</div>
```

### 2. 타이포그래피 사용

#### 방법 1: Typography 컴포넌트 사용 (권장)

타입 안전하고 일관된 타이포그래피를 위해 Typography 컴포넌트를 사용하세요.

```tsx
import { Typography } from '@/components';

<Typography variant="title-1" weight="bold" color="title">
  메인 제목
</Typography>

<Typography variant="body-1" weight="regular" color="body">
  본문 텍스트
</Typography>

<Typography variant="caption-1" weight="medium" color="sub-body">
  캡션 텍스트
</Typography>
```

#### 방법 2: Tailwind 유틸리티 클래스 조합 (유연한 사용)

```tsx
<h1 className="text-title-1 font-pretendard font-bold text-text-title">
  제목 (36px, Bold)
</h1>

<p className="text-body-1 font-pretendard font-regular text-text-body">
  본문 텍스트 (16px, Regular)
</p>

<span className="text-caption-1 font-pretendard font-medium text-text-sub-body">
  캡션 텍스트 (12px, Medium)
</span>
```

#### 방법 3: 숫자 기반 fontSize (기존 호환성)

```tsx
<div className="text-10 font-bold">36px</div>
<div className="text-4 font-regular">16px</div>
<div className="text-1 font-medium">12px</div>
```

### 3. 폰트 패밀리

```tsx
<div className="font-pretendard">
  Pretendard 폰트
</div>

<div className="font-preahvihear">
  Preahvihear 폰트
</div>
```

**참고**: `semi-bold` weight를 사용하면 자동으로 `preahvihear` 폰트가 적용됩니다. 이는 디자인 시스템의 의도입니다.

### 4. 폰트 크기

#### 의미있는 이름 (권장)

```tsx
<div className="text-title-1">36px</div>
<div className="text-title-2">28px</div>
<div className="text-title-3">24px</div>
<div className="text-headline-1">22px</div>
<div className="text-headline-2">20px</div>
<div className="text-headline-3">18px</div>
<div className="text-body-1">16px</div>
<div className="text-body-1-reading">16px (reading line-height)</div>
<div className="text-body-2">14px</div>
<div className="text-body-3">13px</div>
<div className="text-caption-1">12px</div>
<div className="text-caption-2">11px</div>
```

#### 숫자 기반 (기존 호환성)

```tsx
<div className="text-0">11px</div>
<div className="text-1">12px</div>
<div className="text-2">13px</div>
<div className="text-3">14px</div>
<div className="text-4">16px</div>
<div className="text-5">18px</div>
<div className="text-6">20px</div>
<div className="text-7">22px</div>
<div className="text-8">24px</div>
<div className="text-9">28px</div>
<div className="text-10">36px</div>
```

## 색상 팔레트

### Neutral

- `neutral-0` ~ `neutral-100`: 그레이 스케일

### Primary

- `primary` 또는 `primary-normal`: #fee500
- `primary-strong`: #9e8f00
- `primary-heavy`: #665c00
- `primary-light`: #fff170

### Text Colors

- `text-title`: #171714
- `text-body`: #666666
- `text-sub-body`: #707070 (WCAG AA compliant, changed from #999999 for 4.5:1 contrast ratio)
- `text-disabled`: #707070 (WCAG AA compliant, changed from #e0e0e0 for 4.5:1 contrast ratio. Same as text-sub-body for accessibility)

### Atomic Colors

다양한 색상 팔레트가 제공됩니다:

- `atomic-red-*`
- `atomic-orange-*`
- `atomic-lime-*`
- `atomic-green-*`
- `atomic-cyan-*`
- `atomic-light-blue-*`
- `atomic-blue-*`
- `atomic-violet-*`
- `atomic-purple-*`
- `atomic-pink-*`
- `atomic-yellow-*`

각 색상은 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100 단계를 가집니다.

## 타이포그래피 Variants

### Title

- `title-1`: 36px
- `title-2`: 28px
- `title-3`: 24px

### Headline

- `headline-1`: 22px
- `headline-2`: 20px
- `headline-3`: 18px

### Body

- `body-1`: 16px
- `body-1-reading`: 16px (reading line-height)
- `body-2`: 14px
- `body-3`: 13px

### Caption

- `caption-1`: 12px
- `caption-2`: 11px

## Font Weights

- `bold`: 700
- `medium`: 500
- `regular`: 400
- `semi-bold`: 400 (preahvihear 폰트 사용)

**참고**: `semi-bold`는 디자인 시스템에서 `preahvihear` 폰트의 `regular` weight를 사용합니다. 이는 디자인 의도입니다.

## 예시

### Typography 컴포넌트 사용

```tsx
import { Typography } from '@/components';

export const ExampleComponent = () => {
  return (
    <div className="bg-bg p-8">
      <Typography variant="title-1" weight="bold" color="title">
        메인 제목
      </Typography>

      <Typography variant="headline-1" weight="medium" color="title">
        서브 제목
      </Typography>

      <Typography variant="body-1" weight="regular" color="body">
        본문 텍스트입니다. 이 스타일은 16px 크기의 Regular 폰트를 사용합니다.
      </Typography>

      <button className="bg-primary text-neutral-90 px-4 py-2 rounded">
        <Typography variant="body-2" weight="medium">
          버튼
        </Typography>
      </button>
    </div>
  );
};
```

### Tailwind 유틸리티 클래스 사용

```tsx
export const ExampleComponent = () => {
  return (
    <div className="bg-bg p-8">
      <h1 className="text-title-1 font-pretendard font-bold text-text-title mb-4">메인 제목</h1>

      <h2 className="text-headline-1 font-pretendard font-medium text-text-title mb-2">서브 제목</h2>

      <p className="text-body-1 font-pretendard font-regular text-text-body mb-4">
        본문 텍스트입니다. 이 스타일은 16px 크기의 Regular 폰트를 사용합니다.
      </p>

      <button className="bg-primary text-neutral-90 px-4 py-2 rounded">
        <span className="text-body-2 font-pretendard font-medium">버튼</span>
      </button>
    </div>
  );
};
```

## TypeScript 타입 사용

```tsx
import type { TypographyVariant, TypographyWeight, ColorToken } from '@/styles/design-system';

const variant: TypographyVariant = 'title-1';
const weight: TypographyWeight = 'bold';
const color: ColorToken = 'pri-normal';
```

## 마이그레이션 가이드

### 이전 방식 (제거됨)

```tsx
// ❌ 더 이상 사용하지 않음
<h1 className="text-title-36-bold text-text-title">제목</h1>
```

### 새로운 방식 (권장)

```tsx
// ✅ Typography 컴포넌트 사용
<Typography variant="title-1" weight="bold" color="title">
  제목
</Typography>

// ✅ 또는 Tailwind 유틸리티 조합
<h1 className="text-title-1 font-pretendard font-bold text-text-title">
  제목
</h1>
```
