import { ApiProperty } from '@nestjs/swagger';
import { LeaderboardEntry } from '../domain/leaderboard-entry';
import { User } from '../../users/domain/user';

export class LeaderboardEntryDto implements LeaderboardEntry {
  @ApiProperty()
  id: number | string;

  @ApiProperty({
    example: 'dice_rolling_contest',
  })
  leaderboardId: string;

  @ApiProperty()
  userId: number | string;

  // username derived from user object when populated

  @ApiProperty()
  user?: User;

  @ApiProperty({
    example: 1500,
  })
  score: number;

  @ApiProperty({
    example: { gameMode: 'classic', diceCount: 6 },
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
