import { LeaderboardEntry } from '../../../../domain/leaderboard-entry';
import { LeaderboardEntrySchemaClass } from '../entities/leaderboard-entry.schema';

export class LeaderboardEntryMapper {
  static toDomain(raw: LeaderboardEntrySchemaClass): LeaderboardEntry {
    const domainEntity = new LeaderboardEntry();
    domainEntity.id = raw._id.toString();
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
  ): Omit<LeaderboardEntrySchemaClass, '_id' | 'createdAt' | 'updatedAt'> {
    const persistenceEntity = new LeaderboardEntrySchemaClass();
    persistenceEntity.leaderboardId = domainEntity.leaderboardId;
    persistenceEntity.username = domainEntity.username;
    persistenceEntity.score = domainEntity.score;
    persistenceEntity.metadata = domainEntity.metadata;
    persistenceEntity.timestamp = domainEntity.timestamp;

    return persistenceEntity;
  }
}
