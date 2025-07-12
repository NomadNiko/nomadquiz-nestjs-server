import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamQuestionsSeedService } from './exam-questions-seed.service';
import { ExamQuestionSchemaClass, ExamQuestionSchema } from '../../../../exams/infrastructure/persistence/document/entities/exam-question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamQuestionSchemaClass.name, schema: ExamQuestionSchema },
    ]),
  ],
  providers: [ExamQuestionsSeedService],
  exports: [ExamQuestionsSeedService],
})
export class ExamQuestionsSeedModule {}