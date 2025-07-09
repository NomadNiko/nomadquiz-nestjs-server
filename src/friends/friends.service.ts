import { Injectable } from '@nestjs/common';
import { FriendRequestManagementService } from './services/friend-request-management.service';
import { FriendRequestResponseService } from './services/friend-request-response.service';
import { FriendQueryService } from './services/friend-query.service';
import { FriendRequest } from './domain/friend-request';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FriendRequestDto } from './dto/friend-request.dto';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRequestManagementService: FriendRequestManagementService,
    private readonly friendRequestResponseService: FriendRequestResponseService,
    private readonly friendQueryService: FriendQueryService,
  ) {}

  // Friend Request Management
  async sendFriendRequest(
    requesterId: FriendRequest['requesterId'],
    recipientUsername: string,
  ): Promise<FriendRequest> {
    return this.friendRequestManagementService.sendFriendRequest(
      requesterId,
      recipientUsername,
    );
  }

  async cancelFriendRequest(
    requesterId: FriendRequest['requesterId'],
    requestId: FriendRequest['id'],
  ): Promise<void> {
    return this.friendRequestManagementService.cancelFriendRequest(
      requesterId,
      requestId,
    );
  }

  // Friend Request Response
  async acceptFriendRequest(
    recipientId: FriendRequest['recipientId'],
    requestId: FriendRequest['id'],
  ): Promise<FriendRequest> {
    return this.friendRequestResponseService.acceptFriendRequest(
      recipientId,
      requestId,
    );
  }

  async rejectFriendRequest(
    recipientId: FriendRequest['recipientId'],
    requestId: FriendRequest['id'],
  ): Promise<FriendRequest> {
    return this.friendRequestResponseService.rejectFriendRequest(
      recipientId,
      requestId,
    );
  }

  // Friend Query Operations
  async getPendingSentRequests(
    requesterId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    return this.friendQueryService.getPendingSentRequests(
      requesterId,
      paginationOptions,
    );
  }

  async getPendingReceivedRequests(
    recipientId: FriendRequest['recipientId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    return this.friendQueryService.getPendingReceivedRequests(
      recipientId,
      paginationOptions,
    );
  }

  async getFriendsList(
    userId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    return this.friendQueryService.getFriendsList(userId, paginationOptions);
  }

  async getUserFriendsList(
    targetUserId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    return this.friendQueryService.getUserFriendsList(
      targetUserId,
      paginationOptions,
    );
  }

  // Utility methods
  async getFriendRequestById(
    id: FriendRequest['id'],
  ): Promise<NullableType<FriendRequest>> {
    return this.friendRequestManagementService.getFriendRequestById(id);
  }
}
