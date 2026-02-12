import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages';
import LoginPage from '@/pages/Login/LoginPage';
import SignUpPage from '@/pages/SignUp/SignUpPage';
import DefaultLogin from '@/pages/Login/DefaultLogin';
import EmailForm from '@/pages/SignUp/EmailForm';
import KakaoCallbackPage from '@/pages/Login/KakaoCallbackPage';
import SplashPage from '@/pages/Splash/SplashPage';
import OnboardingPage from '@/pages/Onboarding/OnboardingPage';
import AssetPage from '@/pages/Asset/AssetPage';
import RecommendPage from '@/pages/Recommend/RecommendPage';
import { CurrentGoalPage } from '@/pages/Goal/List/CurrentGoalPage';
import { PastGoalPage } from '@/pages/Goal/List/PastGoalPage';
import AmountAchievedPage from '@/pages/Goal/Detail/AmountAchievedPage';
import GoalCreatePage from '@/pages/Goal/Create/GoalCreatePage';
import GoalCreateStep from '@/pages/Goal/Create/GoalCreateStep';
import GoalCompletePage from '@/pages/Goal/Create/GoalCompletePage';
import SavingSimulationPage from '@/pages/Goal/Detail/SavingSimulationPage';
import GoalAlmostDonePage from '@/pages/Goal/Edit/GoalAlmostDonePage';
import {
  BankConnectionStartPage,
  BankSelectPage,
  BankIdInputPage,
  BankPasswordInputPage,
  BankConnectingPage,
  BankConnectedPage,
  BankAdditionalConnectionPage,
} from '@/pages/Bank';
import {
  CardConnectionStartPage,
  CardSelectPage,
  CardIdInputPage,
  CardPasswordInputPage,
  CardConnectingPage,
  CardConnectedPage,
  CardAdditionalConnectionPage,
} from '@/pages/Card';
import { AssetAccountDetailPage } from '@/pages/Asset/tab/AssetDetails/AssetAccountDetailPage';
import { MbtiPage } from '@/pages/Mbti/MbtiPage';
import { SectorDetailPage } from '@/pages/Asset/tab/SectorAnalysis/SectorDetailPage';
import { SectorFullListPage } from '@/pages/Asset/tab/SectorAnalysis/SectorFullListPage';
import { AssetDetails } from '@/pages/Asset/tab/AssetDetails/AssetDetailsPage';
import { SectorAnalysis } from '@/pages/Asset/tab/SectorAnalysis/SectorAnalysisPage';
import { CompareAnalysis } from '@/pages/Asset/tab/CompareAnalysis/CompareAnalysisPage';
import { MenuGNB } from '@/shared/components/mypage/MenuGNB';
import { SettingsPage } from '@/pages/MyPage/subpages/SettingsPage';
import { ConnectionPage } from '@/pages/MyPage/subpages/ConnectionPage';
import RecommendDetailPage from '@/pages/Recommend/RecommendDetailPage';
import MyPage from '@/pages/MyPage/MyPage';
import { ConnectionDetailPage } from '@/pages/MyPage/subpages/ConnectionDetailPage';
import { LogoutPage } from '@/pages/MyPage/subpages/LogoutPage';
import { WithdrawPage } from '@/pages/MyPage/subpages/WithdrawPage';
import TermsSettingsPage from '@/pages/MyPage/subpages/TermsSettingsPage';
import { PublicRoute } from '@/shared/components/auth/PublicRoute';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <SplashPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'home', element: <HomePage /> },
      {
        path: 'asset',
        element: <AssetPage />,
        children: [
          { index: true, element: <AssetDetails /> },
          { path: 'sector', element: <SectorAnalysis /> },
          { path: 'compare', element: <CompareAnalysis /> },
        ],
      },
      { path: 'asset', element: <AssetPage /> },
      { path: 'asset/account/:id', element: <AssetAccountDetailPage /> },
      { path: 'recommend', element: <RecommendPage /> },
      { path: 'recommend/detail/:id', element: <RecommendDetailPage /> },
      { path: 'goal', element: <Navigate to="/goal/current" replace /> },
      { path: paths.goal.current, element: <CurrentGoalPage /> },
      { path: paths.goal.past, element: <PastGoalPage /> },
      { path: paths.goal.savingSimulation, element: <SavingSimulationPage /> },
      { path: paths.goal.amountAchievedRoute, element: <AmountAchievedPage /> },
      { path: paths.goal.savingsSimulationRoute, element: <SavingSimulationPage /> },
      { path: paths.goal.create, element: <GoalCreatePage /> },
      { path: paths.goal.createStep, element: <GoalCreateStep /> },
      { path: paths.goal.almostDone, element: <GoalAlmostDonePage /> },
      { path: paths.goal.createComplete, element: <GoalCompletePage /> },
      {
        element: <PublicRoute />, // 인증된 사용자는 아래 경로 접근 불가
        children: [
          { path: 'login', element: <DefaultLogin /> },
          { path: 'login/form', element: <LoginPage /> },
          { path: 'signup', element: <SignUpPage /> },
          { path: '/signup/email', element: <EmailForm /> },
        ],
      },
      { path: 'login/kakao/callback', element: <KakaoCallbackPage /> },
      { path: 'mbti', element: <MbtiPage /> },
      { path: 'bank/start', element: <BankConnectionStartPage /> },
      { path: 'bank/select', element: <BankSelectPage /> },
      { path: 'bank/input-id', element: <BankIdInputPage /> },
      { path: 'bank/input-password', element: <BankPasswordInputPage /> },
      { path: 'bank/connecting', element: <BankConnectingPage /> },
      { path: 'bank/connected', element: <BankConnectedPage /> },
      { path: 'bank/additional', element: <BankAdditionalConnectionPage /> },
      { path: 'card/start', element: <CardConnectionStartPage /> },
      { path: 'card/select', element: <CardSelectPage /> },
      { path: 'card/input-id', element: <CardIdInputPage /> },
      { path: 'card/input-password', element: <CardPasswordInputPage /> },
      { path: 'card/connecting', element: <CardConnectingPage /> },
      { path: 'card/connected', element: <CardConnectedPage /> },
      { path: 'card/additional', element: <CardAdditionalConnectionPage /> },
      { path: 'menu', element: <MenuGNB /> },
      {
        path: 'mypage',
        children: [
          { index: true, element: <MyPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'settings/terms', element: <TermsSettingsPage /> },
          { path: 'connection', element: <ConnectionPage /> },
          { path: 'mbti', element: <MbtiPage /> },
          {
            path: '/mypage/connection/detail',
            element: <ConnectionDetailPage />,
          },
        ],
      },
      {
        path: '/logout',
        element: <LogoutPage />, // /settings/logout
      },
      {
        path: '/withdraw',
        element: <WithdrawPage />, // /settings/withdraw
      },
      { path: 'asset/sector-full', element: <SectorFullListPage /> },
      { path: 'asset/sector/:categoryKey', element: <SectorDetailPage /> },
    ],
  },
]);
