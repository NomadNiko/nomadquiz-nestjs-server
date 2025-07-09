import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LeaderboardEntrySchemaClass,
  LeaderboardEntrySchema,
} from './entities/leaderboard-entry.schema';
import { LeaderboardEntryRepository } from '../leaderboard-entry.repository';
import { LeaderboardEntryDocumentRepository } from './repositories/leaderboard-entry.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LeaderboardEntrySchemaClass.name,
        schema: LeaderboardEntrySchema,
      },
    ]),
  ],
  providers: [
    {
      provide: LeaderboardEntryRepository,
      useClass: LeaderboardEntryDocumentRepository,
    },
  ],
  exports: [LeaderboardEntryRepository],
})
export class DocumentLeaderboardEntryPersistenceModule {}
