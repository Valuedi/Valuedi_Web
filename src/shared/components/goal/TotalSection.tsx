import GoalProgressGauge from './detail/GoalProgressGauge';
import GoalSummaryCard from './detail/GoalSummaryCard';

type Goal = {
  bankIcon?: string;
  progress: number;
  title: string;
  targetAmount: number;
  remainingDays: number;
  goalId?: number;
};

interface GoalSummaryProps {
  goal: Goal;
}

const TotalSection = ({ goal }: GoalSummaryProps) => {
  if (goal.goalId === undefined) {
    return null;
  }
  return (
    <>
      <GoalProgressGauge goalId={goal.goalId} />
      <GoalSummaryCard goalId={goal.goalId} />
    </>
  );
};

export default TotalSection;
