# 프로젝트 구조

이 프로젝트는 **Feature-Based Architecture**를 따릅니다.

## 📁 디렉토리 구조

```
src/
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── index.ts
│   └── README.md
│
├── features/           # 기능별 모듈 (Feature-Based)
│   └── auth/           # 인증 기능
│       ├── components/      # Feature 전용 컴포넌트
│       └── README.md
│
├── components/         # 공통 컴포넌트
│   └── README.md       # 여러 feature에서 공유하는 재사용 가능한 컴포넌트
│
├── hooks/              # 커스텀 훅
│   └── README.md
│
├── utils/              # 유틸리티 함수
│   └── README.md
│
├── lib/                # 라이브러리 설정
│   ├── queryClient.ts  # TanStack Query 설정
│   └── index.ts
│
├── styles/             # 전역 스타일
│   └── globals.css
│
├── App.tsx            # 루트 컴포넌트
└── main.tsx           # 진입점
```

## 🏗️ Feature 구조

각 feature는 다음과 같은 구조를 가집니다:

```
features/
└── [feature-name]/
    ├── [Feature]Page.tsx    # 페이지 컴포넌트
    ├── [feature].api.ts     # API 함수들 (TanStack Query 사용)
    ├── [feature].store.ts   # Zustand store (클라이언트 상태)
    ├── components/          # Feature 전용 컴포넌트
    │   └── ...
    └── index.ts            # Public API (외부에서 import할 것들)
```

### 예시: auth feature

```typescript
// features/auth/index.ts
export { AuthPage } from './AuthPage';
export { useAuthStore } from './auth.store';
export * from './auth.api';

// 다른 곳에서 사용
import { AuthPage, useAuthStore } from '@/features/auth';
```

## 📦 주요 개념

### 1. Feature-Based Architecture
- 각 기능을 독립적인 모듈로 분리
- 관련된 모든 코드(컴포넌트, API, 상태관리)를 한 곳에 모음
- 재사용성과 유지보수성 향상

### 2. 상태 관리
- **Zustand**: 클라이언트 상태 (UI 상태, 인증 상태 등)
- **TanStack Query**: 서버 상태 (API 데이터 캐싱, 동기화)

### 3. API 관리
- 각 feature의 `*.api.ts`에 API 함수 정의
- `utils/api.ts`의 헬퍼 함수 사용 (생성 필요)
- TanStack Query와 통합

### 4. 컴포넌트 분리
- **Feature 컴포넌트**: `features/[feature]/components/` (feature 전용)
- **공통 컴포넌트**: `components/` (여러 feature에서 공유)

## 🚀 사용 예시

### 새로운 Feature 추가하기

1. `src/features/[feature-name]/` 디렉토리 생성
2. 필요한 파일들 생성:
   - `[Feature]Page.tsx`
   - `[feature].api.ts`
   - `[feature].store.ts`
   - `components/` (필요시)
   - `index.ts`
3. `src/pages/`에 페이지 추가 또는 라우팅 설정

### API 호출 예시

```typescript
// features/auth/auth.api.ts
import { apiPost } from '@/utils/api';

export const loginApi = (data: LoginRequest) => 
  apiPost<LoginResponse>('/auth/login', data);
```

### Store 사용 예시

```typescript
// features/auth/auth.store.ts
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // 로그인 로직
  },
}));
```

### TanStack Query 사용 예시

```typescript
// features/auth/components/AuthForm.tsx
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../auth.api';

export const AuthForm = () => {
  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // 성공 처리
    },
  });
  // ...
};
```

## 📝 네이밍 규칙

- **파일명**: kebab-case (예: `auth.api.ts`, `auth.store.ts`)
- **컴포넌트**: PascalCase (예: `AuthPage.tsx`, `AuthForm.tsx`)
- **함수/변수**: camelCase (예: `loginApi`, `useAuthStore`)
- **타입/인터페이스**: PascalCase (예: `LoginRequest`, `AuthState`)

## 🔗 Import 경로

절대 경로를 사용하려면 `tsconfig.json`에 path alias가 설정되어 있습니다:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

다음과 같이 import할 수 있습니다:

```typescript
import { useAuthStore } from '@/features/auth';
import { apiGet } from '@/utils/api';
```

## 📚 협업 가이드

각 디렉토리에는 `README.md` 파일이 있어 해당 폴더의 용도와 구조를 설명합니다.

- 새로운 feature를 추가할 때는 해당 feature 폴더의 README를 참고하세요.
- 공통 컴포넌트는 `components/` 폴더에 배치하세요.
- 유틸리티 함수는 `utils/` 폴더에 배치하세요.
