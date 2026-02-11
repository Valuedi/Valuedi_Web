/** 목표 생성 완료 후 location.state로 전달되는 데이터 */
export interface GoalCompleteState {
  goalId: number;
  goalName: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  remainingDays: number;
  bankName: string;
  accountNumber: string;
  /** 목표 색상 (6자리 hex). 있으면 아이콘 배경으로 사용 */
  colorCode?: string;
  /** 목표 아이콘 ID (1~11). 있으면 해당 아이콘 표시 */
  iconId?: number;
}
