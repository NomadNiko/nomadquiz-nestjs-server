import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';
import { User } from '../../users/domain/user';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export class Message {
  @ApiProperty({
    type: idType,
  })
  @Expose({ groups: ['me', 'admin'] })
  id: number | string;

  @ApiProperty({
    type: idType,
    description: 'ID of the conversation this message belongs to',
  })
  conversationId: number | string;

  @ApiProperty({
    type: () => User,
    required: false,
    description: 'User who sent the message (optional for system messages)',
  })
  senderId?: User;

  @ApiProperty({
    type: String,
    description: 'Content of the message',
    example: 'Hello, how are you?',
  })
  content: string;

  @ApiProperty({
    type: String,
    enum: ['user', 'system'],
    default: 'user',
    description: 'Type of message',
  })
  type: 'user' | 'system';

  @ApiProperty({
    type: String,
    required: false,
    description: 'URL of attached image',
  })
  imageUrl?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Name of attached file',
  })
  fileName?: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Size of attached file in bytes',
  })
  fileSize?: number;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the message was sent',
  })
  timestamp: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;
}