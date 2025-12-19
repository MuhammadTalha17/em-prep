import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { questions } from '../db/schema';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(@Inject('DB') private readonly db: any) {}

  async createBulk(questionsData: CreateQuestionDto[]) {
    try {
      const result = await this.db
        .insert(questions)
        .values(questionsData)
        .returning();

      return {
        success: true,
        count: result.length,
        questions: result,
      };
    } catch (error) {
      throw new Error(`Failed to save questions: ${error.message}`);
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
