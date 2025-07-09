import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export class FriendRequest {
  @ApiProperty({
    type: idType,
  })
  @Expose({ groups: ['me', 'admin'] })
  id: number | string;

  @ApiProperty({
    type: idType,
    description: 'ID of the user who sent the friend request',
  })
  requesterId: number | string;

  @ApiProperty({
    type: idType,
    description: 'ID of the user who received the friend request',
  })
  recipientId: number | string;

  @ApiProperty({
    enum: FriendRequestStatus,
    description: 'Status of the friend request',
  })
  status: FriendRequestStatus;

  @ApiProperty({
    type: Date,
    description: 'When the friend request was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'When the friend request was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
    description: 'When the friend request status was last changed',
    required: false,
  })
  statusChangedAt?: Date;
}
