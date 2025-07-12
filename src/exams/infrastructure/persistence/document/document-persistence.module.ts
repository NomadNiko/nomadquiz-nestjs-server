import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamQuestionSchemaClass, ExamQuestionSchema } from './entities/exam-question.schema';
import { DocumentExamQuestionRepository } from './repositories/exam-question.repository';
import { ExamQuestionRepository } from '../exam-question.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamQuestionSchemaClass.name, schema: ExamQuestionSchema },
    ]),
  ],
  providers: [
    {
      provide: ExamQuestionRepository,
      useClass: DocumentExamQuestionRepository,
    },
  ],
  exports: [ExamQuestionRepository, MongooseModule],
})
export class DocumentExamQuestionPersistenceModule {}