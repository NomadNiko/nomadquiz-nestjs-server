import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FriendRequest } from '../domain/friend-request';
import { User } from '../../users/domain/user';

export class FriendRequestDto extends FriendRequest {
  @ApiProperty({
    type: () => User,
    description: 'User who sent the friend request',
    required: false,
  })
  @Type(() => User)
  requester?: User;

  @ApiProperty({
    type: () => User,
    description: 'User who received the friend request',
    required: false,
  })
  @Type(() => User)
  recipient?: User;
}
