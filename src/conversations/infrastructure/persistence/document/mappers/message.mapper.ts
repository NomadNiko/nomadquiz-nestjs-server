import { Injectable } from '@nestjs/common';
import { Message } from '../../../../domain/message';
import { MessageSchemaClass } from '../entities/message.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { User } from '../../../../../users/domain/user';

@Injectable()
export class MessageMapper {
  static toDomain(raw: MessageSchemaClass): Message {
    const domainEntity = new Message();
    domainEntity.id = raw._id.toString();
    domainEntity.conversationId = raw.conversationId.toString();
    
    if (raw.senderId) {
      if (typeof raw.senderId === 'object' && '_id' in raw.senderId) {
        domainEntity.senderId = UserMapper.toDomain(raw.senderId as any);
      } else if (raw.senderId) {
        // If it's just an ObjectId, create a minimal user object
        const user = new User();
        user.id = (raw.senderId as any).toString();
        domainEntity.senderId = user;
      }
    }
    
    domainEntity.content = raw.content;
    domainEntity.type = raw.type as 'user' | 'system';
    domainEntity.imageUrl = raw.imageUrl;
    domainEntity.fileName = raw.fileName;
    domainEntity.fileSize = raw.fileSize;
    domainEntity.timestamp = raw.timestamp;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Message): MessageSchemaClass {
    const persistenceEntity = new MessageSchemaClass();
    // MongoDB expects _id to be string, so we don't set it when creating new documents
    // Mongoose will generate it automatically
    persistenceEntity.conversationId = domainEntity.conversationId as any;
    persistenceEntity.senderId = domainEntity.senderId?.id as any;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.imageUrl = domainEntity.imageUrl;
    persistenceEntity.fileName = domainEntity.fileName;
    persistenceEntity.fileSize = domainEntity.fileSize;
    persistenceEntity.timestamp = domainEntity.timestamp;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}