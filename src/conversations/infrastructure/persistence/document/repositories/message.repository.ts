import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageRepository } from '../../message.repository';
import { Message } from '../../../../domain/message';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { MessageSchemaClass } from '../entities/message.schema';
import { MessageMapper } from '../mappers/message.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MessageDocumentRepository implements MessageRepository {
  constructor(
    @InjectModel(MessageSchemaClass.name)
    private readonly messageModel: Model<MessageSchemaClass>,
  ) {}

  async create(data: Message): Promise<Message> {
    const persistenceModel = MessageMapper.toPersistence(data);
    const createdEntity = new this.messageModel({
      ...persistenceModel,
      conversationId: new Types.ObjectId(data.conversationId as string),
      senderId: data.senderId ? new Types.ObjectId(data.senderId.id as string) : undefined,
    });
    
    const savedEntity = await createdEntity.save();
    const populatedEntity = await this.messageModel
      .findById(savedEntity._id)
      .populate('senderId')
      .exec();
      
    return populatedEntity
      ? MessageMapper.toDomain(populatedEntity)
      : MessageMapper.toDomain(savedEntity);
  }

  async findById(id: Message['id']): Promise<NullableType<Message>> {
    const entity = await this.messageModel
      .findById(id)
      .populate('senderId')
      .exec();
      
    return entity ? MessageMapper.toDomain(entity) : null;
  }

  async findByConversation(
    conversationId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Message[]> {
    const skip = (paginationOptions.page - 1) * paginationOptions.limit;
    const conversationObjectId = new Types.ObjectId(conversationId);
    
    const entities = await this.messageModel
      .find({ conversationId: conversationObjectId })
      .populate('senderId')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(paginationOptions.limit)
      .exec();
      
    return entities.map((entity) => MessageMapper.toDomain(entity));
  }

  async countByConversation(conversationId: string): Promise<number> {
    const conversationObjectId = new Types.ObjectId(conversationId);
    return this.messageModel.countDocuments({
      conversationId: conversationObjectId,
    });
  }

  async findLastMessageByConversation(
    conversationId: string,
  ): Promise<NullableType<Message>> {
    const conversationObjectId = new Types.ObjectId(conversationId);
    
    const entity = await this.messageModel
      .findOne({ conversationId: conversationObjectId })
      .populate('senderId')
      .sort({ timestamp: -1 })
      .exec();
      
    return entity ? MessageMapper.toDomain(entity) : null;
  }

  async deleteByConversation(conversationId: string): Promise<void> {
    const conversationObjectId = new Types.ObjectId(conversationId);
    await this.messageModel.deleteMany({
      conversationId: conversationObjectId,
    });
  }
}