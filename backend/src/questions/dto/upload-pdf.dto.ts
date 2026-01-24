import { CreateQuestionDto } from './create-question.dto';

export class UploadPdfResponseDto {
  success: boolean;
  count: number;
  questions: CreateQuestionDto[];
}
