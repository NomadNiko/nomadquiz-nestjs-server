import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { DocumentExamQuestionPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentExamQuestionPersistenceModule
  : DocumentExamQuestionPersistenceModule; // Only MongoDB for now

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService, infrastructurePersistenceModule],
})
export class ExamsModule {}