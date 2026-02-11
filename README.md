# 💰 VALUEDI - 밸류디

> 개인의 소비 패턴 및 금융 성향을 분석하여 최적화된 맞춤형 자산 관리 경험을 제공하는 금융 솔루션

---

## 🌿 Branch Strategy

효율적인 협업을 위해 **이슈/기능 단위의 브랜치 전략**과 **Squash Merge** 방식 채택

### 브랜치 네이밍 규칙

형식: `태그/작업명`

* `feat` : 신규 기능 개발
* `fix` : 오류 및 버그 수정
* `refactor` : 코드 개선 및 리팩토링
* `docs` : 문서 수정
* `chore` : 기타 변경 사항
* **예시**: `feat/login`, `fix/login-error`, `refactor/main-api`

---

## 🧾 Commit Convention

형식: `태그: 작업 내용 요약`

* `feat`: 새로운 기능 추가
* `fix`: 오류 및 버그 수정
* `docs`: 문서 수정
* `style`: 코드 포맷팅
* `refactor`: 리팩토링
* `rename`: 파일 혹은 폴더명 수정
* `test`: 테스트 코드 추가
* `remove`: 파일 혹은 폴더 삭제
* `design`: UI 스타일링 및 레이아웃 개선
* `chore`: 기타 변경 사항
* **예시**:`feat: 자산 내역 페이지 구현`, `fix: 목표 관리 금액 계산 오류 수정`

---

## 🚀 Tech Stack & Decision Making

### 🧩 Core Stack

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite\&logoColor=white)
![npm](https://img.shields.io/badge/npm-Package%20Manager-CB3837?logo=npm\&logoColor=white)

* **React 18.2**

  * React 19의 보안 취약점(CVE-2025-55182)을 고려하여 안정성이 검증된 버전 채택
  * Concurrency Rendering 및 Automatic Batching을 활용한 UI 응답성 확보
* **TypeScript**

  * 정적 타이핑을 통한 런타임 에러 사전 방지 및 팀 간 인터페이스 협업 안정성 확보
* **Vite**

  * Webpack 대비 빠른 빌드 속도와 효율적인 HMR을 통한 개발 생산성 극대화
* **npm**

  * 팀 내 표준 패키지 매니저로 채택하여 의존성 관리 일관성 유지

---

### 🗂️ State & Data Fetching

![Zustand](https://img.shields.io/badge/Zustand-State%20Management-000000)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-v5-FF4154?logo=reactquery\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP%20Client-5A29E4?logo=axios\&logoColor=white)

* **Zustand**

  * Context API의 불필요한 리렌더링 문제 해결
  * Redux 대비 간결한 구조로 상태 관리 로직 경량화
* **TanStack Query v5**

  * 직접 구현하기 복잡한 서버 데이터의 캐싱, 신선도 관리 및 HTTP 요청 상태를 선언적으로 처리
* **Axios**

  * API 통신 레이어를 명확히 분리하여 인터셉터 기반 인증 및 에러 핸들링

---

### 🎨 Style & Interaction

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss\&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-CSS%20Engine-DD3A0A?logo=postcss\&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer--motion-Animation-0055FF?logo=framer\&logoColor=white)
![clsx](https://img.shields.io/badge/clsx-black)
![tailwind-merge](https://img.shields.io/badge/tailwind--merge-blueviolet)

* **Tailwind CSS**

  * CSS-in-JS의 런타임 오버헤드 없이 빌드 타임 스타일 생성을 통해 모바일 최적화 및 초기 렌더링 성능 확보
* **PostCSS**

  * Tailwind CSS의 핵심 엔진으로 활용하며, 최신 CSS 문법을 모든 브라우저에 대응하도록 자동 변환하여 호환성 보장
* **Framer-motion**

  * `react-spring` 대비 낮은 러닝 커브와 직관적인 API를 보유하여 바텀 시트 등 고도화된 인터랙션을 효율적으로 구현
* **clsx / tailwind-merge**

  * 공용 컴포넌트 설계 시 외부 주입 스타일과 내부 기본 스타일 간의 충돌을 방지하고 조건부 스타일 가독성 확보

---

### 🛠️ Dev Tools

![Storybook](https://img.shields.io/badge/Storybook-UI%20Dev-FF4785?logo=storybook\&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-Code%20Quality-4B32C3?logo=eslint\&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-Code%20Formatter-F7B93E?logo=prettier\&logoColor=black)

* **Storybook**:

  * 비즈니스 로직과 분리된 독립적 UI 개발 환경을 구축하여 컴포넌트 재사용성 및 테스트 편의성 제고
* **Vite-plugin-svgr**

  * SVG 이미지를 React 컴포넌트화하여 Props 기반의 유연한 스타일링 제어 환경 구축
* **ESLint / Prettier**

  * 코드 컨벤션을 자동화하여 코드 품질을 유지하고 로직 설계에만 집중할 수 있는 환경 조성

---

## 🏛️ Project Architecture (FSD 기반)

본 프로젝트는 **Feature-Sliced Design(FSD)** 아키텍처를 기반으로 확장성과 유지보수성을 고려해 설계되었습니다.

```text
src/
├── assets/          # 정적 자원
├── components/      # 전역 공용 컴포넌트
├── features/        # 도메인별 비즈니스 로직 및 API
├── hooks/           # 커스텀 훅 및 글로벌 Store
├── lib/             # 라이브러리 설정
├── pages/           # 라우트별 페이지
├── router/          # 라우팅 정의
├── stories/         # Storybook 명세
├── styles/          # 전역 스타일 및 테마
├── utils/           # 범용 유틸리티 함수
├── App.tsx          # 루트 컴포넌트
└── main.tsx         # 엔트리 포인트
```

---

## ✨ Core Features

### 🧠 소비 패턴 MBTI 분석

* 금융 성향 테스트를 기반으로 사용자 소비 타입 도출
* 소비 습관, 위험 선호도, 저축 성향을 시각화한 맞춤형 리포트 제공

### 🎯 목표 관리 (Goal)

* 저축 목표 설정 및 달성 현황 트래킹
* 달성률 기반 진행 현황 시각화 및 동기 부여

### 💳 자산 및 거래 내역 통합 조회

* 은행 / 카드사 연동을 통한 계좌 및 소비 내역 통합 관리
* 월별·카테고리별 지출 분석 제공

### 📈 맞춤형 금융 상품 추천

* 사용자의 소비 성향 기반 최적 금융 상품 매칭

---

## 👥 Members

* **최도현** / **임혜미** / **강승희** / **변상우**
