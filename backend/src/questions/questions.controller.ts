import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { BulkCreateQuestionsDto } from './dto/bulk-create-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { UploadPdfResponseDto } from './dto/upload-pdf.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('bulk')
  async createBulk(@Body(ValidationPipe) dto: BulkCreateQuestionsDto) {
    return this.questionsService.createBulk(dto.questions);
  }

  @Post('upload-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadPdfResponseDto> {
    // Validate file exists
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // Validate file type
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }
    return this.questionsService.processPdfUpload(file);
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
