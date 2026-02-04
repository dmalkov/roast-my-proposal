export interface DimensionScore {
  score: number;
  reasoning: string;
  examples: string[];
}

export interface RoastDimensions {
  valuePropClarity: DimensionScore;
  pricingConfidence: DimensionScore;
  socialProof: DimensionScore;
  urgencyFomo: DimensionScore;
  competitorAwareness: DimensionScore;
  jargonDensity: DimensionScore;
}

export interface RoastFix {
  before: string;
  after: string;
  explanation: string;
}

export interface RoastResult {
  overallScore: number;
  letterGrade: string;
  verdict: string;
  dimensions: RoastDimensions;
  roasts: string[];
  fixes: RoastFix[];
  niceThing: string;
}

export interface ApiResponse {
  success: boolean;
  data?: RoastResult;
  error?: string;
}
