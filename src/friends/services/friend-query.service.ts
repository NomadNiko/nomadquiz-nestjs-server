import { Injectable } from '@nestjs/common';
import { FriendRequestRepository } from '../infrastructure/persistence/friend-request.repository';
import { UsersService } from '../../users/users.service';
import { FriendRequest } from '../domain/friend-request';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { FriendRequestDto } from '../dto/friend-request.dto';

@Injectable()
export class FriendQueryService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly usersService: UsersService,
  ) {}

  async getPendingSentRequests(
    requesterId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const result = await this.friendRequestRepository.findPendingSentByUser(
      requesterId,
      paginationOptions,
    );

    // Populate recipient user data
    const data = await Promise.all(
      result.data.map(async (friendRequest) => {
        const recipient = await this.usersService.findById(
          friendRequest.recipientId,
        );
        const dto = new FriendRequestDto();
        Object.assign(dto, friendRequest);
        dto.recipient = recipient || undefined;
        return dto;
      }),
    );

    return {
      data,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    };
  }

  async getPendingReceivedRequests(
    recipientId: FriendRequest['recipientId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const result = await this.friendRequestRepository.findPendingReceivedByUser(
      recipientId,
      paginationOptions,
    );

    // Populate requester user data
    const data = await Promise.all(
      result.data.map(async (friendRequest) => {
        const requester = await this.usersService.findById(
          friendRequest.requesterId,
        );
        const dto = new FriendRequestDto();
        Object.assign(dto, friendRequest);
        dto.requester = requester || undefined;
        return dto;
      }),
    );

    return {
      data,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    };
  }

  async getFriendsList(
    userId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const result = await this.friendRequestRepository.findAcceptedFriendsByUser(
      userId,
      paginationOptions,
    );

    // Populate friend user data (the other user in the friendship)
    const data = await Promise.all(
      result.data.map(async (friendRequest) => {
        const friendId =
          friendRequest.requesterId === userId
            ? friendRequest.recipientId
            : friendRequest.requesterId;

        const friend = await this.usersService.findById(friendId);
        const dto = new FriendRequestDto();
        Object.assign(dto, friendRequest);

        // Set the friend as either requester or recipient depending on the relationship
        if (friendRequest.requesterId === userId) {
          dto.recipient = friend || undefined;
        } else {
          dto.requester = friend || undefined;
        }

        return dto;
      }),
    );

    return {
      data,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    };
  }

  async getUserFriendsList(
    targetUserId: FriendRequest['requesterId'],
    paginationOptions: IPaginationOptions,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    // This method allows viewing another user's friends list
    // In a real application, you might want to add privacy controls here
    return this.getFriendsList(targetUserId, paginationOptions);
  }
}
