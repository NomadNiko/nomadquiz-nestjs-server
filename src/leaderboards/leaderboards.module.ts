import { Module } from '@nestjs/common';
import { LeaderboardsController } from './leaderboards.controller';
import { LeaderboardsService } from './leaderboards.service';
import { RelationalLeaderboardEntryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DocumentLeaderboardEntryPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentLeaderboardEntryPersistenceModule
  : RelationalLeaderboardEntryPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
  exports: [LeaderboardsService, infrastructurePersistenceModule],
})
export class LeaderboardsModule {}
