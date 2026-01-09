import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages';
import LoginPage from '@/pages/Login/LoginPage';
import SignUpPage from '@/pages/SignUp/SignUpPage';
import DefaultLogin from '@/pages/Login/DefaultLogin';
import SignUpEmailContainer from '@/components/signup/SignUpEmailContainer';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <DefaultLogin /> },
      { path: 'login/form', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: '/signup/email', element: <SignUpEmailContainer /> },
    ],
  },
]);
