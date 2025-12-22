import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsString()
  @IsNotEmpty()
  questionType: string;

  @IsArray()
  @IsNotEmpty()
  choices: any[];

  @IsString()
  @IsNotEmpty()
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
