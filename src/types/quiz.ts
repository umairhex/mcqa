export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuestionState {
  questionId: number;
  selectedOptionId: string | null;
  isLocked: boolean;
  isFeedbackShown: boolean;
  isAnswered: boolean;
}

export type QuizPhase = "setup" | "quiz" | "complete";

export type QuestionPhase =
  | "active"
  | "selection"
  | "locked"
  | "evaluation"
  | "feedback"
  | "progression";

export interface ValidationError {
  isValid: false;
  message: string;
  questionIndex?: number;
  fieldName?: string;
}

export interface ValidationSuccess {
  isValid: true;
  data: QuizQuestion[];
}

export type ValidationResult = ValidationSuccess | ValidationError;
