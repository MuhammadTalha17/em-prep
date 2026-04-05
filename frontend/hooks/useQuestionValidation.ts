"use client";

import { useMemo } from "react";
import { Question, validateQuestions } from "@/lib/validation";

export function useQuestionValidation(questions: Question[]) {
  const validation = useMemo(() => {
    if (questions.length === 0) {
      return {
        results: [],
        summary: {
          totalQuestions: 0,
          validCount: 0,
          invalidCount: 0,
          needsReviewCount: 0,
          duplicateIndices: [],
        },
        hasValidationRun: false,
      };
    }
    return {
      ...validateQuestions(questions),
      hasValidationRun: true,
    };
  }, [questions]);

  const canSave = validation.summary.invalidCount === 0 && questions.length > 0;

  return {
    ...validation,
    canSave,
  };
}