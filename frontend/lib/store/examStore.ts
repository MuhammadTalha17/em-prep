import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExamState {
  selectedCategories: string[];
  questionIds: string[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  showResults: boolean;
  setSelectedCategories: (categories: string[]) => void;
  setQuestionIds: (questionIds: string[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setShowResults: (show: boolean) => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      selectedCategories: [],
      questionIds: [],
      currentQuestionIndex: 0,
      answers: {},
      showResults: false,
      setSelectedCategories: (categories) =>
        set({ selectedCategories: categories }),
      setQuestionIds: (questionIds) => set({ questionIds }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),
      setShowResults: (show) => set({ showResults: show }),
      resetExam: () =>
        set({
          selectedCategories: [],
          questionIds: [],
          currentQuestionIndex: 0,
          answers: {},
          showResults: false,
        }),
    }),
    {
      name: "exam-storage",
    }
  )
);
