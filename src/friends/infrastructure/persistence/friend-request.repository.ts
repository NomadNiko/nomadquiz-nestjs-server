import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import {
  FriendRequest,
  FriendRequestStatus,
} from '../../domain/friend-request';

export abstract class FriendRequestRepository {
  abstract create(
    data: Omit<FriendRequest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<FriendRequest>;

  abstract findById(
    id: FriendRequest['id'],
  ): Promise<NullableType<FriendRequest>>;

  abstract findByRequesterAndRecipient(
    requesterId: FriendRequest['requesterId'],
    recipientId: FriendRequest['recipientId'],
  ): Promise<NullableType<FriendRequest>>;

  abstract findPendingSentByUser(
    requesterId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequest[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  abstract findPendingReceivedByUser(
    recipientId: FriendRequest['recipientId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequest[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  abstract findAcceptedFriendsByUser(
    userId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequest[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  abstract updateStatus(
    id: FriendRequest['id'],
    status: FriendRequestStatus,
  ): Promise<FriendRequest>;

  abstract update(
    id: FriendRequest['id'],
    payload: DeepPartial<FriendRequest>,
  ): Promise<FriendRequest>;

  abstract delete(id: FriendRequest['id']): Promise<void>;
}
