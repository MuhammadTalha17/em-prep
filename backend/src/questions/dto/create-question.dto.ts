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
  question_text: string;

  @IsString()
  @IsNotEmpty()
  question_type: string;

  @IsArray()
  @IsNotEmpty()
  choices: any[];

  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  plan_level: string;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsObject()
  @IsOptional()
  raw_survey_json?: any;
}
