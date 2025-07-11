import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConversationRepository } from '../../conversation.repository';
import { Conversation } from '../../../../domain/conversation';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { ConversationSchemaClass } from '../entities/conversation.schema';
import { ConversationMapper } from '../mappers/conversation.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ConversationDocumentRepository implements ConversationRepository {
  constructor(
    @InjectModel(ConversationSchemaClass.name)
    private readonly conversationModel: Model<ConversationSchemaClass>,
  ) {}

  async create(data: Conversation): Promise<Conversation> {
    const persistenceModel = ConversationMapper.toPersistence(data);
    const participantObjectIds = data.participants.map(
      (p) => new Types.ObjectId(p.id as string),
    );
    
    const createdEntity = new this.conversationModel({
      ...persistenceModel,
      participants: participantObjectIds,
    });
    
    const savedEntity = await createdEntity.save();
    const populatedEntity = await this.conversationModel
      .findById(savedEntity._id)
      .populate({
        path: 'participants',
        select: '_id email firstName lastName photo role status createdAt updatedAt username provider socialId'
      })
      .exec();
      
    return populatedEntity
      ? ConversationMapper.toDomain(populatedEntity)
      : ConversationMapper.toDomain(savedEntity);
  }

  async findById(id: Conversation['id']): Promise<NullableType<Conversation>> {
    const entity = await this.conversationModel
      .findById(id)
      .populate({
        path: 'participants',
        select: '_id email firstName lastName photo role status createdAt updatedAt username provider socialId'
      })
      .exec();
      
    return entity ? ConversationMapper.toDomain(entity) : null;
  }

  async findByParticipants(
    participantIds: string[],
  ): Promise<NullableType<Conversation>> {
    const participantObjectIds = participantIds.map(
      (id) => new Types.ObjectId(id),
    );
    
    const entity = await this.conversationModel
      .findOne({
        participants: {
          $all: participantObjectIds,
          $size: participantObjectIds.length,
        },
      })
      .populate({
        path: 'participants',
        select: '_id email firstName lastName photo role status createdAt updatedAt username provider socialId'
      })
      .exec();
      
    return entity ? ConversationMapper.toDomain(entity) : null;
  }

  async findUserConversations(userId: string): Promise<Conversation[]> {
    const userObjectId = new Types.ObjectId(userId);
    
    const entities = await this.conversationModel
      .find({ participants: userObjectId })
      .populate({
        path: 'participants',
        select: '_id email firstName lastName photo role status createdAt updatedAt username provider socialId'
      })
      .sort({ lastMessageAt: -1 })
      .exec();
      
    return entities.map((entity) => ConversationMapper.toDomain(entity));
  }

  async update(
    id: Conversation['id'],
    payload: Partial<Conversation>,
  ): Promise<NullableType<Conversation>> {
    const updatePayload = { ...payload };
    
    // Handle participants conversion to ObjectIds the same way as create method
    if (payload.participants && Array.isArray(payload.participants)) {
      const participantObjectIds = payload.participants.map(
        (p) => new Types.ObjectId(p.id as string),
      );
      updatePayload.participants = participantObjectIds as any;
    }
    
    const entity = await this.conversationModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .populate({
        path: 'participants',
        select: '_id email firstName lastName photo role status createdAt updatedAt username provider socialId'
      })
      .exec();
      
    return entity ? ConversationMapper.toDomain(entity) : null;
  }

  async softDelete(id: Conversation['id']): Promise<void> {
    await this.conversationModel.findByIdAndDelete(id).exec();
  }
}