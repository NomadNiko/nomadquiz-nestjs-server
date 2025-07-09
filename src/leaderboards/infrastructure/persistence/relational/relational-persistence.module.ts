import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardEntryEntity } from './entities/leaderboard-entry.entity';
import { LeaderboardEntryRepository } from '../leaderboard-entry.repository';
import { LeaderboardEntryRelationalRepository } from './repositories/leaderboard-entry.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LeaderboardEntryEntity])],
  providers: [
    {
      provide: LeaderboardEntryRepository,
      useClass: LeaderboardEntryRelationalRepository,
    },
  ],
  exports: [LeaderboardEntryRepository],
})
export class RelationalLeaderboardEntryPersistenceModule {}
