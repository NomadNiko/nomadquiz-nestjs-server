import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FriendRequest,
  FriendRequestStatus,
} from '../../../../domain/friend-request';
import { FriendRequestRepository } from '../../friend-request.repository';
import { FriendRequestSchemaClass } from '../entities/friend-request.schema';
import { FriendRequestMapper } from '../mappers/friend-request.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class FriendRequestDocumentRepository
  implements FriendRequestRepository
{
  constructor(
    @InjectModel(FriendRequestSchemaClass.name)
    private readonly friendRequestModel: Model<FriendRequestSchemaClass>,
  ) {}

  async create(
    data: Omit<FriendRequest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<FriendRequest> {
    const persistenceModel = FriendRequestMapper.toPersistence(
      data as FriendRequest,
    );
    const createdEntity = new this.friendRequestModel(persistenceModel);
    const saved = await createdEntity.save();
    return FriendRequestMapper.toDomain(saved);
  }

  async findById(
    id: FriendRequest['id'],
  ): Promise<NullableType<FriendRequest>> {
    const entity = await this.friendRequestModel.findById(id).exec();
    return entity ? FriendRequestMapper.toDomain(entity) : null;
  }

  async findByRequesterAndRecipient(
    requesterId: FriendRequest['requesterId'],
    recipientId: FriendRequest['recipientId'],
  ): Promise<NullableType<FriendRequest>> {
    const entity = await this.friendRequestModel
      .findOne({
        requesterId: requesterId as string,
        recipientId: recipientId as string,
      })
      .exec();
    return entity ? FriendRequestMapper.toDomain(entity) : null;
  }

  async findPendingSentByUser(
    requesterId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequest[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const page = paginationOptions.page ?? 1;
    const limit = paginationOptions.limit ?? 10;
    const skip = (page - 1) * limit;

    const [entities] = await Promise.all([
      this.friendRequestModel
        .find({
          requesterId: requesterId as string,
          status: FriendRequestStatus.PENDING,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit + 1)
        .exec(),
    ]);

    const hasNextPage = entities.length > limit;
    const data = entities.slice(0, limit);
    const hasPreviousPage = page > 1;

    return {
      data: data.map((entity) => FriendRequestMapper.toDomain(entity)),
      hasNextPage,
      hasPreviousPage,
    };
  }

  async findPendingReceivedByUser(
    recipientId: FriendRequest['recipientId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequest[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const page = paginationOptions.page ?? 1;
    const limit = paginationOptions.limit ?? 10;
    const skip = (page - 1) * limit;

    const [entities] = await Promise.all([
      this.friendRequestModel
        .find({
          recipientId: recipientId as string,
          status: FriendRequestStatus.PENDING,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit + 1)
        .exec(),
    ]);

    const hasNextPage = entities.length > limit;
    const data = entities.slice(0, limit);
    const hasPreviousPage = page > 1;

    return {
      data: data.map((entity) => FriendRequestMapper.toDomain(entity)),
      hasNextPage,
      hasPreviousPage,
    };
  }

  async findAcceptedFriendsByUser(
    userId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequest[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const page = paginationOptions.page ?? 1;
    const limit = paginationOptions.limit ?? 10;
    const skip = (page - 1) * limit;

    const userIdString = userId as string;

    const [entities] = await Promise.all([
      this.friendRequestModel
        .find({
          $or: [{ requesterId: userIdString }, { recipientId: userIdString }],
          status: FriendRequestStatus.ACCEPTED,
        })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit + 1)
        .exec(),
    ]);

    const hasNextPage = entities.length > limit;
    const data = entities.slice(0, limit);
    const hasPreviousPage = page > 1;

    return {
      data: data.map((entity) => FriendRequestMapper.toDomain(entity)),
      hasNextPage,
      hasPreviousPage,
    };
  }

  async updateStatus(
    id: FriendRequest['id'],
    status: FriendRequestStatus,
  ): Promise<FriendRequest> {
    const entity = await this.friendRequestModel
      .findByIdAndUpdate(
        id,
        {
          status,
          statusChangedAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!entity) {
      throw new Error('Friend request not found');
    }

    return FriendRequestMapper.toDomain(entity);
  }

  async update(
    id: FriendRequest['id'],
    payload: DeepPartial<FriendRequest>,
  ): Promise<FriendRequest> {
    const entity = await this.friendRequestModel
      .findByIdAndUpdate(
        id,
        {
          ...FriendRequestMapper.toPersistence(payload as FriendRequest),
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!entity) {
      throw new Error('Friend request not found');
    }

    return FriendRequestMapper.toDomain(entity);
  }

  async delete(id: FriendRequest['id']): Promise<void> {
    await this.friendRequestModel.findByIdAndDelete(id).exec();
  }
}
