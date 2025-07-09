import { ApiProperty } from '@nestjs/swagger';
import { LeaderboardEntry } from '../domain/leaderboard-entry';

export class LeaderboardEntryDto implements LeaderboardEntry {
  @ApiProperty()
  id: number | string;

  @ApiProperty({
    example: 'dice_rolling_contest',
  })
  leaderboardId: string;

  @ApiProperty({
    example: 'john_doe',
  })
  username: string;

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
