import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';
import { User } from '../../users/domain/user';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export class LeaderboardEntry {
  @ApiProperty({
    type: idType,
  })
  @Expose({ groups: ['me', 'admin'] })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'dice_rolling_contest',
    description: 'Unique identifier for the leaderboard',
  })
  leaderboardId: string;

  @ApiProperty({
    type: idType,
    description: 'ID of the user who achieved this score',
  })
  @Expose({ groups: ['admin'] })
  userId: number | string;

  @ApiProperty({
    type: () => User,
    description: 'User information (populated)',
    required: false,
  })
  @Type(() => User)
  @Expose({ groups: ['me', 'admin'] })
  user?: User;

  // username removed - derived from populated user object

  @ApiProperty({
    type: Number,
    example: 1500,
    description: 'Player score for this leaderboard',
  })
  score: number;

  @ApiProperty({
    type: Object,
    example: { gameMode: 'classic', diceCount: 6 },
    description: 'Additional metadata about the score',
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
