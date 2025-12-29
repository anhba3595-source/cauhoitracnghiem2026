
export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type QuizStatus = 'idle' | 'loading' | 'quiz' | 'result';

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  status: QuizStatus;
  topic: string;
}
