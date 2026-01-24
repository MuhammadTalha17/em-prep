import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { questions } from '../db/schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UploadPdfResponseDto } from './dto/upload-pdf.dto';
import { createClient } from '@supabase/supabase-js';

const execAsync = promisify(exec);

@Injectable()
export class QuestionsService {
  private supabase: any;

  constructor(@Inject('DB') private readonly db: any) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    );
  }

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

  async processPdfUpload(
    file: Express.Multer.File,
  ): Promise<UploadPdfResponseDto> {
    //1. save pdf temporarily:
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    const pdfPath = path.join(tempDir, `${Date.now()}_${file.originalname}`);
    await fs.writeFile(pdfPath, file.buffer);

    //2. run pythonscript:
    // Define scriptPath outside try block so it's accessible in finally
    const scriptPath = path.join(
      process.cwd(),
      'scripts', // Changed from '..'
      'pdf_to_excel.py',
    );

    try {
      // Check if script exists
      try {
        await fs.access(scriptPath);
      } catch {
        throw new Error(`Python script not found at: ${scriptPath}`);
      }

      const { stdout, stderr } = await execAsync(
        `python "${scriptPath}" "${pdfPath}"`,
      );

      console.log('Python output:', stdout);
      if (stderr && stderr.includes('Error')) {
        throw new Error(`Python script error: ${stderr}`);
      }

      // 3. Read JSON output
      const jsonPath = path.join(
        path.dirname(scriptPath),
        'questions_output.json',
      );

      // Check if JSON file exists
      try {
        await fs.access(jsonPath);
      } catch {
        throw new Error(
          `JSON output file not found. Python script may have failed to generate output.`,
        );
      }

      const jsonData = await fs.readFile(jsonPath, 'utf-8');

      let questions;
      try {
        questions = JSON.parse(jsonData);
      } catch (parseError) {
        throw new Error(`Failed to parse JSON output: ${parseError.message}`);
      }
      // Validate that we got an array
      if (!Array.isArray(questions)) {
        throw new Error('Invalid JSON format: expected an array of questions');
      }
      if (questions.length === 0) {
        throw new Error('No questions were extracted from the PDF');
      }

      // 4. Upload images and replace paths
      for (const question of questions) {
        if (question.image_url) {
          const imagePath = path.join(
            path.dirname(scriptPath),
            question.image_url,
          );
          console.log(`Uploading question image from: ${imagePath}`);
          try {
            const uploadedUrl = await this.uploadImageToSupabase(imagePath);
            console.log(`Successfully uploaded to: ${uploadedUrl}`);
            question.image_url = uploadedUrl;
          } catch (e) {
            console.error(`Failed to upload image ${question.image_url}:`, e);
            question.image_url = null;
          }
        }
        if (question.explanation_image_url) {
          const imagePath = path.join(
            path.dirname(scriptPath),
            question.explanation_image_url,
          );
          try {
            question.explanation_image_url =
              await this.uploadImageToSupabase(imagePath);
          } catch (e) {
            console.error(
              `Failed to upload explanation image ${question.explanation_image_url}:`,
              e,
            );
            question.explanation_image_url = null;
          }
        }
      }

      return {
        success: true,
        count: questions.length,
        questions,
      };
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error(`Failed to process PDF: ${error.message}`);
    } finally {
      // 5. Cleanup temp PDF file
      await fs.unlink(pdfPath).catch(() => {});

      // 6. Cleanup extracted images folder
      const extractedImagesDir = path.join(
        path.dirname(scriptPath),
        'extracted_images',
      );

      try {
        // Check if directory exists
        await fs.access(extractedImagesDir);
        // Remove all files in the directory
        const files = await fs.readdir(extractedImagesDir);
        await Promise.all(
          files.map((file) =>
            fs.unlink(path.join(extractedImagesDir, file)).catch(() => {}),
          ),
        );
        console.log(`Cleaned up ${files.length} extracted images`);
      } catch {
        // Directory doesn't exist or other error, ignore
      }
    }
  }

  private async uploadImageToSupabase(localPath: string): Promise<string> {
    const fileContent = await fs.readFile(localPath);
    const fileName = `questions/${Date.now()}_${path.basename(localPath)}`;

    const { data, error } = await this.supabase.storage
      .from('images')
      .upload(fileName, fileContent, {
        contentType: 'image/png', // Python script saves as PNG
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = this.supabase.storage.from('images').getPublicUrl(fileName);

    return publicUrl;
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
