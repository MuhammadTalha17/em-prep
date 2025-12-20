import { apiClient } from "./axios";

export interface CreateQuestionDto {
  questionText: string;
  questionType: string;
  choices: any[];
  correctAnswer: string;
  category: string;
  planLevel: string;
  explanation?: string;
  imageUrl?: string;
  rawSurveyJson?: any;
}

export const questionsApi = {
  // POST /questions/bulk
  bulkCreate: async (questions: CreateQuestionDto[]) => {
    const response = await apiClient.post("/questions/bulk", { questions });
    return response.data;
  },
  // GET /questions
  getAll: async () => {
    const response = await apiClient.get("/questions");
    return response.data;
  },
  // GET /questions/category?name=Cardiology
  getByCategory: async (category: string) => {
    const response = await apiClient.get("/questions/category", {
      params: { name: category },
    });
    return response.data;
  },
};
