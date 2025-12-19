import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { BulkCreateQuestionsDto } from './dto/bulk-create-dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('bulk')
  async createBulk(@Body(ValidationPipe) dto: BulkCreateQuestionsDto) {
    return this.questionsService.createBulk(dto.questions);
  }

  @Get()
  async findAll() {
    return this.questionsService.findAll();
  }

  @Get('category')
  async findByCategory(@Query('name') category: string) {
    return this.questionsService.findByCategory(category);
  }
}
