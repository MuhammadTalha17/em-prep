import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  Matches,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsObject()
  @IsNotEmpty()
  choices: Record<string, string>;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-E]$/, { message: 'Correct answer must be A, B, C, D, or E' })
  correctAnswer: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
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
