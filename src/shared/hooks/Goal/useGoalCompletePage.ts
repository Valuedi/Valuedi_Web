import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from '@/router/paths';
import type { GoalCompleteState } from '@/pages/Goal/Create/types';

export function useGoalCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as GoalCompleteState | null | undefined;

  const handleBack = () => navigate(-1);
  const handleGoHome = () => navigate('/home');
  const handleGoToGoal = () => {
    if (state?.goalId != null) {
      navigate(paths.goal.amountAchieved(state.goalId));
    } else {
      navigate('/goal/current');
    }
  };
  const handleGoToList = () => navigate('/goal/current');

  return { state, navigate, handleBack, handleGoHome, handleGoToGoal, handleGoToList };
}
