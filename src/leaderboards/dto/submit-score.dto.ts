import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class SubmitScoreDto {
  @ApiProperty({
    example: 'dice_rolling_contest',
    description: 'Unique identifier for the leaderboard',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  leaderboardId: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the player',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: 1500,
    description: 'Player score for this leaderboard',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  score: number;

  @ApiPropertyOptional({
    example: { gameMode: 'classic', diceCount: 6 },
    description: 'Additional metadata about the score',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
