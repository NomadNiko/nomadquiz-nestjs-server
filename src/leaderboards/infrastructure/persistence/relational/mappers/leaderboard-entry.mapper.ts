import { LeaderboardEntry } from '../../../../domain/leaderboard-entry';
import { LeaderboardEntryEntity } from '../entities/leaderboard-entry.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class LeaderboardEntryMapper {
  static toDomain(raw: LeaderboardEntryEntity): LeaderboardEntry {
    const domainEntity = new LeaderboardEntry();
    domainEntity.id = raw.id;
    domainEntity.leaderboardId = raw.leaderboardId;
    domainEntity.userId = raw.userId;
    
    // Handle populated user
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.score = raw.score;
    domainEntity.metadata = raw.metadata;
    domainEntity.timestamp = raw.timestamp;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: Omit<LeaderboardEntry, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<LeaderboardEntryEntity, 'id' | 'createdAt' | 'updatedAt' | 'user'> {
    const persistenceEntity = new LeaderboardEntryEntity();
    persistenceEntity.leaderboardId = domainEntity.leaderboardId;
    persistenceEntity.userId = domainEntity.userId as number;
    // username not stored in persistence - derived from user relationship
    persistenceEntity.score = domainEntity.score;
    persistenceEntity.metadata = domainEntity.metadata;
    persistenceEntity.timestamp = domainEntity.timestamp;

    return persistenceEntity;
  }
}
