import { Injectable } from '@nestjs/common';
import { Conversation } from '../../../../domain/conversation';
import { ConversationSchemaClass } from '../entities/conversation.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { User } from '../../../../../users/domain/user';

@Injectable()
export class ConversationMapper {
  static toDomain(raw: ConversationSchemaClass): Conversation {
    const domainEntity = new Conversation();
    domainEntity.id = raw._id.toString();
    
    domainEntity.participants = raw.participants
      ? (raw.participants as any[]).map((participant) => {
          if (participant && typeof participant === 'object' && participant._id) {
            // This is a populated user document - has _id field
            return UserMapper.toDomain(participant);
          }
          // If it's just an ObjectId, create a minimal user object
          const user = new User();
          user.id = participant.toString();
          return user;
        })
      : [];
    domainEntity.name = raw.name;
    domainEntity.lastMessageAt = raw.lastMessageAt;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Conversation): ConversationSchemaClass {
    const persistenceEntity = new ConversationSchemaClass();
    // MongoDB expects _id to be string, so we don't set it when creating new documents
    // Mongoose will generate it automatically
    persistenceEntity.participants = domainEntity.participants?.map(
      (participant) => participant.id,
    ) as any;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.lastMessageAt = domainEntity.lastMessageAt;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}