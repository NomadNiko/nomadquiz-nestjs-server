import { FriendRequest } from '../../../../domain/friend-request';
import { FriendRequestSchemaClass } from '../entities/friend-request.schema';

export class FriendRequestMapper {
  static toDomain(raw: FriendRequestSchemaClass): FriendRequest {
    const domainEntity = new FriendRequest();

    // Critical: Always convert ObjectId to string
    domainEntity.id = raw._id.toString();
    domainEntity.requesterId = raw.requesterId.toString();
    domainEntity.recipientId = raw.recipientId.toString();
    domainEntity.status = raw.status;
    domainEntity.statusChangedAt = raw.statusChangedAt;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: FriendRequest,
  ): Partial<FriendRequestSchemaClass> {
    const persistenceEntity: Partial<FriendRequestSchemaClass> = {};

    if (domainEntity.requesterId) {
      persistenceEntity.requesterId = domainEntity.requesterId as any;
    }
    if (domainEntity.recipientId) {
      persistenceEntity.recipientId = domainEntity.recipientId as any;
    }
    if (domainEntity.status) {
      persistenceEntity.status = domainEntity.status;
    }
    if (domainEntity.statusChangedAt) {
      persistenceEntity.statusChangedAt = domainEntity.statusChangedAt;
    }
    if (domainEntity.createdAt) {
      persistenceEntity.createdAt = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updatedAt = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
