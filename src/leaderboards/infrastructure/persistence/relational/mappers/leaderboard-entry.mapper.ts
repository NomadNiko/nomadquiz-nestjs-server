import { LeaderboardEntry } from '../../../../domain/leaderboard-entry';
import { LeaderboardEntryEntity } from '../entities/leaderboard-entry.entity';

export class LeaderboardEntryMapper {
  static toDomain(raw: LeaderboardEntryEntity): LeaderboardEntry {
    const domainEntity = new LeaderboardEntry();
    domainEntity.id = raw.id;
    domainEntity.leaderboardId = raw.leaderboardId;
    domainEntity.username = raw.username;
    domainEntity.score = raw.score;
    domainEntity.metadata = raw.metadata;
    domainEntity.timestamp = raw.timestamp;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: Omit<LeaderboardEntry, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<LeaderboardEntryEntity, 'id' | 'createdAt' | 'updatedAt'> {
    const persistenceEntity = new LeaderboardEntryEntity();
    persistenceEntity.leaderboardId = domainEntity.leaderboardId;
    persistenceEntity.username = domainEntity.username;
    persistenceEntity.score = domainEntity.score;
    persistenceEntity.metadata = domainEntity.metadata;
    persistenceEntity.timestamp = domainEntity.timestamp;

    return persistenceEntity;
  }
}
