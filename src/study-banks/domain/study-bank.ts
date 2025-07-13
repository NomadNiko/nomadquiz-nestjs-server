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

export class StudyBank {
  @ApiProperty({
    type: idType,
  })
  @Expose({ groups: ['me', 'admin'] })
  id: number | string;

  @ApiProperty({
    type: idType,
    description: 'ID of the user who owns this study bank',
  })
  userId: number | string;

  @ApiProperty({
    type: User,
    description: 'User who owns this study bank',
  })
  user?: User;

  @ApiProperty({
    type: [String],
    example: ['64a1b2c3d4e5f6789abcdef0', '64a1b2c3d4e5f6789abcdef1'],
    description: 'Array of question IDs saved in this study bank',
  })
  questionIds: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}