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
      .populate('participants')
      .exec();
      
    return populatedEntity
      ? ConversationMapper.toDomain(populatedEntity)
      : ConversationMapper.toDomain(savedEntity);
  }

  async findById(id: Conversation['id']): Promise<NullableType<Conversation>> {
    const entity = await this.conversationModel
      .findById(id)
      .populate('participants')
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
      .populate('participants')
      .exec();
      
    return entity ? ConversationMapper.toDomain(entity) : null;
  }

  async findUserConversations(userId: string): Promise<Conversation[]> {
    const userObjectId = new Types.ObjectId(userId);
    
    console.log('🔍 Finding conversations for user:', userId);
    
    const entities = await this.conversationModel
      .find({ participants: userObjectId })
      .populate('participants')
      .sort({ lastMessageAt: -1 })
      .exec();
      
    console.log('🔍 Raw query result - first entity participants:', 
      entities[0] ? entities[0].participants.map((p: any) => ({
        id: p._id?.toString(),
        email: p.email,
        firstName: p.firstName,
        isPopulated: !!p.email
      })) : 'no entities'
    );
      
    return entities.map((entity) => ConversationMapper.toDomain(entity));
  }

  async update(
    id: Conversation['id'],
    payload: Partial<Conversation>,
  ): Promise<NullableType<Conversation>> {
    const entity = await this.conversationModel
      .findByIdAndUpdate(id, payload, { new: true })
      .populate('participants')
      .exec();
      
    return entity ? ConversationMapper.toDomain(entity) : null;
  }

  async softDelete(id: Conversation['id']): Promise<void> {
    await this.conversationModel.findByIdAndDelete(id).exec();
  }
}