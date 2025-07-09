import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FriendRequestRepository } from '../infrastructure/persistence/friend-request.repository';
import { FriendRequest, FriendRequestStatus } from '../domain/friend-request';

@Injectable()
export class FriendRequestResponseService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
  ) {}

  async acceptFriendRequest(
    recipientId: FriendRequest['recipientId'],
    requestId: FriendRequest['id'],
  ): Promise<FriendRequest> {
    const friendRequest =
      await this.friendRequestRepository.findById(requestId);
    if (!friendRequest) {
      throw new BadRequestException('Friend request not found');
    }

    // Only the recipient can accept the request
    if (friendRequest.recipientId !== recipientId) {
      throw new ForbiddenException(
        'You can only accept friend requests sent to you',
      );
    }

    // Only pending requests can be accepted
    if (friendRequest.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException(
        'Only pending friend requests can be accepted',
      );
    }

    return this.friendRequestRepository.updateStatus(
      requestId,
      FriendRequestStatus.ACCEPTED,
    );
  }

  async rejectFriendRequest(
    recipientId: FriendRequest['recipientId'],
    requestId: FriendRequest['id'],
  ): Promise<FriendRequest> {
    const friendRequest =
      await this.friendRequestRepository.findById(requestId);
    if (!friendRequest) {
      throw new BadRequestException('Friend request not found');
    }

    // Only the recipient can reject the request
    if (friendRequest.recipientId !== recipientId) {
      throw new ForbiddenException(
        'You can only reject friend requests sent to you',
      );
    }

    // Only pending requests can be rejected
    if (friendRequest.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException(
        'Only pending friend requests can be rejected',
      );
    }

    return this.friendRequestRepository.updateStatus(
      requestId,
      FriendRequestStatus.REJECTED,
    );
  }
}
