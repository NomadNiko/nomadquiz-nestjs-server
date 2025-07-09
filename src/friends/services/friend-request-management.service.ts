import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { FriendRequestRepository } from '../infrastructure/persistence/friend-request.repository';
import { FriendRequest, FriendRequestStatus } from '../domain/friend-request';
import { UsersService } from '../../users/users.service';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class FriendRequestManagementService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly usersService: UsersService,
  ) {}

  async sendFriendRequest(
    requesterId: FriendRequest['requesterId'],
    recipientUsername: string,
  ): Promise<FriendRequest> {
    // Find recipient by username
    const recipient = await this.usersService.findByUsername(recipientUsername);
    if (!recipient) {
      throw new BadRequestException('User not found');
    }

    // Prevent sending request to self
    if (requesterId === recipient.id) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // Check for existing request between these users
    const existingRequest =
      await this.friendRequestRepository.findByRequesterAndRecipient(
        requesterId,
        recipient.id,
      );
    if (existingRequest) {
      throw new ConflictException(
        'Friend request already exists between these users',
      );
    }

    // Also check for reverse request (recipient -> requester)
    const reverseRequest =
      await this.friendRequestRepository.findByRequesterAndRecipient(
        recipient.id,
        requesterId,
      );
    if (reverseRequest) {
      throw new ConflictException(
        'Friend request already exists between these users',
      );
    }

    // Create the friend request
    const friendRequest = await this.friendRequestRepository.create({
      requesterId,
      recipientId: recipient.id,
      status: FriendRequestStatus.PENDING,
      statusChangedAt: new Date(),
    });

    return friendRequest;
  }

  async cancelFriendRequest(
    requesterId: FriendRequest['requesterId'],
    requestId: FriendRequest['id'],
  ): Promise<void> {
    const friendRequest =
      await this.friendRequestRepository.findById(requestId);
    if (!friendRequest) {
      throw new BadRequestException('Friend request not found');
    }

    // Only the sender can cancel the request
    if (friendRequest.requesterId !== requesterId) {
      throw new BadRequestException(
        'You can only cancel your own friend requests',
      );
    }

    // Only pending requests can be cancelled
    if (friendRequest.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException(
        'Only pending friend requests can be cancelled',
      );
    }

    await this.friendRequestRepository.updateStatus(
      requestId,
      FriendRequestStatus.CANCELLED,
    );
  }

  async getFriendRequestById(
    id: FriendRequest['id'],
  ): Promise<NullableType<FriendRequest>> {
    return this.friendRequestRepository.findById(id);
  }
}
