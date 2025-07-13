import { Module } from '@nestjs/common';
import { StudyBanksController } from './study-banks.controller';
import { StudyBanksService } from './study-banks.service';
import { DocumentStudyBankPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentStudyBankPersistenceModule
  : DocumentStudyBankPersistenceModule; // Only MongoDB for now

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [StudyBanksController],
  providers: [StudyBanksService],
  exports: [StudyBanksService, infrastructurePersistenceModule],
})
export class StudyBanksModule {}