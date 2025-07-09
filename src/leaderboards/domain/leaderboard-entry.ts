import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

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
    type: String,
    example: 'john_doe',
    description: 'Username of the player',
  })
  username: string;

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
