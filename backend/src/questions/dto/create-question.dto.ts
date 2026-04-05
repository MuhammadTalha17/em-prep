import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';
import { IsValidCategory, IsCorrectAnswerInChoices, IsValidPlanLevel, VALID_CATEGORIES, VALID_PLAN_LEVELS } from './validators/question-validators';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsString()
  @IsNotEmpty()
  questionType: string;

  @IsObject()
  @IsNotEmpty()
  choices: Record<string, string>;

  @IsString()
  @IsNotEmpty()
  @IsCorrectAnswerInChoices({ message: 'correctAnswer must be a key in the choices object' })
  correctAnswer: string;

  @IsString()
  @IsNotEmpty()
  @IsValidCategory({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` })
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPlanLevel({ message: `planLevel must be "${VALID_PLAN_LEVELS[0]}" or "${VALID_PLAN_LEVELS[1]}"` })
  planLevel: string;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  explanationImageUrl?: string;

  @IsObject()
  @IsOptional()
  rawSurveyJson?: any;
}