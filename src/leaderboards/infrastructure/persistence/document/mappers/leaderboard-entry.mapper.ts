import { LeaderboardEntry } from '../../../../domain/leaderboard-entry';
import { LeaderboardEntrySchemaClass } from '../entities/leaderboard-entry.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { Types } from 'mongoose';

export class LeaderboardEntryMapper {
  static toDomain(raw: LeaderboardEntrySchemaClass): LeaderboardEntry {
    const domainEntity = new LeaderboardEntry();
    domainEntity.id = raw._id.toString();
    domainEntity.leaderboardId = raw.leaderboardId;
    
    // Handle userId - stored as string
    domainEntity.userId = raw.userId;

    // Handle virtual populated user
    if ((raw as any).user && !domainEntity.user) {
      domainEntity.user = UserMapper.toDomain((raw as any).user);
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
  ): Omit<LeaderboardEntrySchemaClass, '_id' | 'createdAt' | 'updatedAt'> {
    const persistenceEntity = new LeaderboardEntrySchemaClass();
    persistenceEntity.leaderboardId = domainEntity.leaderboardId;
    persistenceEntity.userId = domainEntity.userId as string;
    // username not stored in persistence - derived from user relationship
    persistenceEntity.score = domainEntity.score;
    persistenceEntity.metadata = domainEntity.metadata;
    persistenceEntity.timestamp = domainEntity.timestamp;

    return persistenceEntity;
  }
}
