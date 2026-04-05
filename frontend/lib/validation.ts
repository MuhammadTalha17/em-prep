// Validation constants - must match across frontend and backend
export const CATEGORIES = [
  "Cardiology",
  "MajorTrauma",
  "MinorTrauma",
  "Pediatrics",
  "Toxicology",
  "Resuscitation",
  "Eye",
  "ENT",
  "ObstetricAndGynaecology",
  "PainAndSedation",
  "Nephrology",
  "Neurology",
  "Gastroenterology",
  "EnvironmentalEmergencies",
  "ElderlyCare",
  "Dermatology",
  "Allergy",
  "OncologicalEmergencies",
  "Musculoskeletal",
  "Respiratory",
  "SurgicalEmergencies",
  "Urology",
  "Vascular",
  "Endocrinology",
  "Haematology",
  "InfectiousDiseases",
  "ProceduralSkills",
  "ComplexOrChallengingSituations",
] as const;

export const PLAN_LEVELS = ["Primary", "Intermediate"] as const;

export type Category = (typeof CATEGORIES)[number];
export type PlanLevel = (typeof PLAN_LEVELS)[number];

export interface Question {
  question_text: string;
  choices: Record<string, string>;
  correct_answer: string;
  category: string;
  explanation: string;
  image_url: string | null;
  explanation_image_url: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface QuestionValidationResult {
  index: number;
  errors: ValidationError[];
  isValid: boolean;
}

export interface ValidationSummary {
  totalQuestions: number;
  validCount: number;
  invalidCount: number;
  needsReviewCount: number;
  duplicateIndices: number[];
}

const VALID_CHOICE_KEYS = ["A", "B", "C", "D", "E"];

export function validateQuestion(
  question: Question,
  index: number,
): QuestionValidationResult {
  const errors: ValidationError[] = [];

  // 1. question_text must be non-empty
  if (!question.question_text?.trim()) {
    errors.push({ field: "question_text", message: "Question text is empty" });
  }

  // 2. choices must be non-empty object with at least one entry
  if (
    !question.choices ||
    typeof question.choices !== "object" ||
    Object.keys(question.choices).length === 0
  ) {
    errors.push({ field: "choices", message: "Choices are empty or invalid" });
  }

  // 3. correct_answer must be a non-empty key in choices
  if (!question.correct_answer?.trim()) {
    errors.push({ field: "correct_answer", message: "Correct answer is empty" });
  } else if (!VALID_CHOICE_KEYS.includes(question.correct_answer)) {
    errors.push({
      field: "correct_answer",
      message: `Must be A-E, got "${question.correct_answer}"`,
    });
  } else if (!question.choices || !(question.correct_answer in question.choices)) {
    errors.push({
      field: "correct_answer",
      message: `"${question.correct_answer}" not found in choices`,
    });
  }

  // 4. category must be a valid enum value
  if (!question.category?.trim()) {
    errors.push({ field: "category", message: "Category is empty" });
  } else if (!CATEGORIES.includes(question.category as Category)) {
    errors.push({ field: "category", message: `Invalid category "${question.category}"` });
  }

  // Note: explanation is optional (can be text or image)
  // Note: image_url and explanation_image_url are optional

  return { index, errors, isValid: errors.length === 0 };
}

export function validateQuestions(questions: Question[]): {
  results: QuestionValidationResult[];
  summary: ValidationSummary;
} {
  const results: QuestionValidationResult[] = [];

  // Detect duplicates first
  const seenQuestions = new Map<string, number[]>();
  questions.forEach((q, index) => {
    if (q.question_text?.trim()) {
      const normalized = q.question_text.trim().toLowerCase();
      const existing = seenQuestions.get(normalized) || [];
      existing.push(index);
      seenQuestions.set(normalized, existing);
    }
  });

  const duplicateIndices: number[] = [];
  seenQuestions.forEach((indices) => {
    if (indices.length > 1) {
      duplicateIndices.push(...indices.slice(1));
    }
  });

  // Validate each question
  questions.forEach((question, index) => {
    const result = validateQuestion(question, index);
    results.push(result);
  });

  const summary: ValidationSummary = {
    totalQuestions: questions.length,
    validCount: results.filter((r) => r.isValid).length,
    invalidCount: results.filter((r) => !r.isValid).length,
    needsReviewCount: results.filter((r) => !r.isValid).length,
    duplicateIndices,
  };

  return { results, summary };
}