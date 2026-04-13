import { Personality, UserAnswers, DimensionScores, DimensionLevels, MatchResult } from './types';

const DIMENSION_IDS = ['S1', 'S2', 'S3', 'E1', 'E2', 'E3', 'A1', 'A2', 'A3', 'Ac1', 'Ac2', 'Ac3', 'So1', 'So2', 'So3'];

export function calculateDimensionScores(answers: UserAnswers, questions: { id: number; options: { text: string; scores: Record<string, number> }[] }[]): DimensionScores {
  const scores: DimensionScores = {};
  
  DIMENSION_IDS.forEach(dim => {
    scores[dim] = 0;
  });

  questions.forEach(question => {
    const answerIndex = answers[question.id];
    if (answerIndex !== undefined && question.options[answerIndex]) {
      const optionScores = question.options[answerIndex].scores;
      DIMENSION_IDS.forEach(dim => {
        if (optionScores[dim]) {
          scores[dim] += optionScores[dim];
        }
      });
    }
  });

  return scores;
}

export function mapToLevel(score: number): 0 | 1 | 2 {
  if (score < -1) return 0;
  if (score > 1) return 2;
  return 1;
}

export function mapToLevels(scores: DimensionScores): DimensionLevels {
  const levels: DimensionLevels = {};
  DIMENSION_IDS.forEach(dim => {
    levels[dim] = mapToLevel(scores[dim]);
  });
  return levels;
}

export function manhattanDistance(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0);
}

export function calculateSimilarity(userVector: number[], template: number[]): number {
  const distance = manhattanDistance(userVector, template);
  return 1 - distance / 30;
}

export function matchPersonality(
  userVector: number[],
  personalities: Personality[],
  hiddenTriggered: boolean = false
): MatchResult {
  const standardPersonalities = hiddenTriggered 
    ? personalities.filter(p => p.type !== 'fallback')
    : personalities.filter(p => p.type !== 'standard');

  let bestMatch: Personality = standardPersonalities[0];
  let bestSimilarity = 0;

  standardPersonalities.forEach(personality => {
    const similarity = calculateSimilarity(userVector, personality.vector);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = personality;
    }
  });

  if (bestSimilarity < 0.6 && !hiddenTriggered) {
    const fallbackPersonality = personalities.find(p => p.type === 'fallback');
    if (fallbackPersonality) {
      return {
        personality: fallbackPersonality,
        similarity: bestSimilarity
      };
    }
  }

  if (hiddenTriggered) {
    const drunkPersonality = personalities.find(p => p.id === 'DRUN-K');
    if (drunkPersonality) {
      return {
        personality: drunkPersonality,
        similarity: 1.0
      };
    }
  }

  return {
    personality: bestMatch,
    similarity: bestSimilarity
  };
}

export function getPersonalityById(id: string, personalities: Personality[]): Personality | undefined {
  return personalities.find(p => p.id === id);
}

export function vectorToLevels(vector: number[]): DimensionLevels {
  const levels: DimensionLevels = {};
  DIMENSION_IDS.forEach((dim, index) => {
    levels[dim] = vector[index] as 0 | 1 | 2;
  });
  return levels;
}

export function getDimensionIds(): string[] {
  return DIMENSION_IDS;
}
