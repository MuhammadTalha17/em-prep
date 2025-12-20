import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { questions } from '../db/schema';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(@Inject('DB') private readonly db: any) {}

  async createBulk(questionsData: CreateQuestionDto[]) {
    try {
      console.log('Received data:', JSON.stringify(questionsData, null, 2));

      const result = await this.db
        .insert(questions)
        .values(questionsData)
        .returning();

      return {
        success: true,
        count: result.length,
        questions: result,
      };
    } catch (error: any) {
      console.error('Error in createBulk:', error);
      throw new Error(
        `Failed to save questions: ${error.message}. ${error.cause ? `Cause: ${error.cause.message}` : ''}`,
      );
    }
  }

  async findAll() {
    return await this.db.select().from(questions);
  }

  async findByCategory(category: string) {
    return await this.db
      .select()
      .from(questions)
      .where(eq(questions.category, category));
  }
}
