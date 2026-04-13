export type DimensionLevel = 0 | 1 | 2;

export interface Dimension {
  id: string;
  name: string;
  model: string;
  description: string;
}

export interface QuestionOption {
  text: string;
  scores: Record<string, number>;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
}

export interface Personality {
  id: string;
  name: string;
  type: 'standard' | 'fallback' | 'hidden';
  color: string;
  mbti: string[];
  vector: number[];
  description: string;
}

export interface UserAnswers {
  [questionId: number]: number;
}

export interface DimensionScores {
  [dimensionId: string]: number;
}

export interface DimensionLevels {
  [dimensionId: string]: DimensionLevel;
}

export interface MatchResult {
  personality: Personality;
  similarity: number;
}
