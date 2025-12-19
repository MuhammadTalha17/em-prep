import {
  pgTable,
  uuid,
  text,
  varchar,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionText: text('question_text').notNull(),
  questionType: varchar('question_type', { length: 50 }).notNull(),
  choices: jsonb('choices').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  planLevel: varchar('plan_level', { length: 50 }).notNull(),
  explanation: text('explanation'),
  imageUrl: text('image_url'),
  rawSurveyJson: jsonb('raw_survey_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
