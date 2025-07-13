import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export class StudyBankDto {
  @ApiProperty({
    type: idType,
  })
  @Expose({ groups: ['me', 'admin'] })
  id: number | string;

  @ApiProperty({
    type: idType,
    description: 'ID of the user who owns this study bank',
  })
  @Expose({ groups: ['me', 'admin'] })
  userId: number | string;

  @ApiProperty({
    type: () => UserDto,
    description: 'User who owns this study bank',
  })
  @Expose({ groups: ['me', 'admin'] })
  @Type(() => UserDto)
  user?: UserDto;

  @ApiProperty({
    type: [String],
    example: ['64a1b2c3d4e5f6789abcdef0', '64a1b2c3d4e5f6789abcdef1'],
    description: 'Array of question IDs saved in this study bank',
  })
  @Expose({ groups: ['me', 'admin'] })
  questionIds: string[];

  @ApiProperty()
  @Expose({ groups: ['me', 'admin'] })
  createdAt: Date;

  @ApiProperty()
  @Expose({ groups: ['me', 'admin'] })
  updatedAt: Date;
}