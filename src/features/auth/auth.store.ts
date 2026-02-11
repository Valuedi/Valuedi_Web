import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  setAccessTokenToStorage,
  setAuthFlag,
  clearAllAuthData,
  getAccessTokenFromStorage,
  setRefreshTokenToStorage,
} from '@/shared/api/tokenService';
import { registerAuthStore } from '@/shared/api/apiClient';

interface User {
  id: number;
  name?: string;
  email?: string;
}

interface AuthState {
  // 메모리 상태: Access Token (보안상 메모리에만 보관)
  accessToken: string | null;
  // 사용자 정보 및 인증 상태
  user: User | null;
  isAuthenticated: boolean;
  // Actions
  login: (memberId: number, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  // Access Token 관리
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
}

/**
 * 인증 상태 관리 스토어
 *
 * - Access Token은 메모리 상태로 관리 (보안 강화)
 * - localStorage에는 최소한의 정보만 저장 (로그인 여부 플래그, 사용자 기본 정보)
 * - 초기화 시 localStorage에서 토큰을 읽어와 메모리 상태로 복원
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // 초기화 시 localStorage에서 토큰 읽어오기
      const initialToken = typeof window !== 'undefined' ? getAccessTokenFromStorage() : null;

      return {
        // 메모리 상태: Access Token
        accessToken: initialToken,
        user: null,
        isAuthenticated: false,

        /**
         * 로그인 처리
         * Access Token을 메모리 상태와 localStorage에 모두 저장
         */
        login: (memberId: number, accessToken: string, refreshToken?: string) => {
          setAccessTokenToStorage(accessToken);
          // 서버가 refreshToken을 함께 내려주는 경우, 토큰 재발급 시 쿼리 파라미터로 사용하기 위해 함께 저장
          if (refreshToken) {
            setRefreshTokenToStorage(refreshToken);
          }
          setAuthFlag(true);
          set({
            accessToken,
            user: { id: memberId },
            isAuthenticated: true,
          });
        },

        /**
         * 로그아웃 처리
         * 모든 인증 관련 데이터 제거
         */
        logout: () => {
          clearAllAuthData();
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
          });
        },

        /**
         * 사용자 정보 업데이트
         */
        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },

        /**
         * 인증 정보 일괄 설정 (토큰 재발급 시 사용)
         */
        setAuth: (accessToken: string, user: User) => {
          setAccessTokenToStorage(accessToken);
          setAuthFlag(true);
          set({
            accessToken,
            user,
            isAuthenticated: true,
          });
        },

        /**
         * 인증 정보 완전 초기화
         */
        clearAuth: () => {
          clearAllAuthData();
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
          });
        },

        /**
         * Access Token 조회 (메모리 상태에서)
         */
        getAccessToken: () => {
          return get().accessToken;
        },

        /**
         * Access Token 설정 (토큰 재발급 시 사용)
         */
        setAccessToken: (token: string) => {
          setAccessTokenToStorage(token);
          set({ accessToken: token });
        },
      };
    },
    {
      name: 'auth-storage',
      // persist 옵션: user 정보만 localStorage에 저장 (accessToken은 제외)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // 초기화 시 localStorage에서 토큰 복원 및 상태 동기화
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const token = getAccessTokenFromStorage();
          if (token) {
            state.accessToken = token;
            // 토큰이 있으면 인증 상태도 true로 설정
            if (!state.isAuthenticated) {
              state.isAuthenticated = true;
            }
          }
          // user 정보가 persist에서 복원되었는지 확인
          // user가 있으면 인증 상태도 true로 설정
          if (state.user && !state.isAuthenticated) {
            state.isAuthenticated = true;
          }
        }
      },
    }
  )
);

// 스토어 초기화 시 apiClient에 참조 등록 (순환 참조 방지)
if (typeof window !== 'undefined') {
  // 스토어가 생성된 후 등록
  const store = useAuthStore.getState();
  registerAuthStore({
    getAccessToken: () => store.accessToken,
    setAccessToken: (token: string) => {
      store.setAccessToken(token);
    },
    clearAuth: () => {
      store.clearAuth();
    },
  });
}
