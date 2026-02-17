export interface MbtiSubmitAnswer {
  questionId: number;
  choiceValue: number;
}

export const formatMbtiAnswersForSubmit = (answers: Record<number, number>): MbtiSubmitAnswer[] => {
  return Object.entries(answers).map(([questionId, choiceValue]) => ({
    questionId: Number(questionId),
    choiceValue,
  }));
};
