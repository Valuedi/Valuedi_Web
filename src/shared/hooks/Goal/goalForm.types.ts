export type GoalStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type GoalFormMode = 'create' | 'edit';

export interface SelectedAccount {
  id: string;
  bankName: string;
  accountNumber: string;
}

export interface SelectedIcon {
  colorId: string;
  iconId: string;
}

export type GoalFormField = 'goalName' | 'startDate' | 'endDate' | 'goalAmount';

export interface GoalFormValues {
  goalName: string;
  startDate: string;
  endDate: string;
  goalAmount: string;
}

export interface GoalFormErrors {
  goalName: string;
  startDate: string;
  endDate: string;
  goalAmount: string;
}

export interface StepValidationResult {
  isValid: boolean;
  error: string;
}

export interface UseGoalFormOptions {
  mode?: GoalFormMode;
  initialValues?: Partial<GoalFormValues> & { selectedAccount?: SelectedAccount | null };
  onSubmit?: (payload: {
    goalName: string;
    startDate: string;
    endDate: string;
    goalAmount: string;
    selectedAccount: SelectedAccount | null;
  }) => void | Promise<void>;
  onBack?: () => void;
}
