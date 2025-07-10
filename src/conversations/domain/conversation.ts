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

export class Conversation {
  @ApiProperty({
    type: idType,
  })
  @Expose({ groups: ['me', 'admin'] })
  id: number | string;

  @ApiProperty({
    type: () => [User],
    description: 'Array of participants in the conversation',
  })
  participants: User[];

  @ApiProperty({
    type: String,
    required: false,
    description: 'Optional name for the conversation/group',
    example: 'Team Discussion',
  })
  name?: string;

  @ApiProperty({
    type: Date,
    description: 'Timestamp of the last message in the conversation',
  })
  lastMessageAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;
}