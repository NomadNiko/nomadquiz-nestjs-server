import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LeaderboardsService } from './leaderboards.service';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { QueryLeaderboardDto } from './dto/query-leaderboard.dto';
import { LeaderboardEntryDto } from './dto/leaderboard-entry.dto';

@ApiTags('Leaderboards')
@Controller({
  path: 'leaderboards',
  version: '1',
})
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Score submitted successfully',
    type: LeaderboardEntryDto,
  })
  async submitScore(@Body() submitScoreDto: SubmitScoreDto) {
    return this.leaderboardsService.submitScore(submitScoreDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'All leaderboards retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          leaderboardId: { type: 'string' },
          entryCount: { type: 'number' },
          topScore: { type: 'number' },
          lastActivity: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getAllLeaderboards() {
    return this.leaderboardsService.getAllLeaderboards();
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':leaderboardId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'leaderboardId',
    type: String,
    required: true,
    description: 'Leaderboard identifier',
  })
  @ApiOkResponse({
    description: 'Leaderboard entries retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/LeaderboardEntryDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async getLeaderboard(
    @Param('leaderboardId') leaderboardId: string,
    @Query() query: QueryLeaderboardDto,
  ) {
    return this.leaderboardsService.getLeaderboard(leaderboardId, query);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('users/:username/entries')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Username to get entries for',
  })
  @ApiOkResponse({
    description: 'User leaderboard entries retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/LeaderboardEntryDto' },
        },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async getUserEntries(
    @Param('username') username: string,
    @Query() query: QueryLeaderboardDto,
  ) {
    return this.leaderboardsService.getUserEntries(username, query);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':leaderboardId/users/:username')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'leaderboardId',
    type: String,
    required: true,
    description: 'Leaderboard identifier',
  })
  @ApiParam({
    name: 'username',
    type: String,
    required: true,
    description: 'Username to get score for',
  })
  @ApiOkResponse({
    description: 'User score for leaderboard retrieved successfully',
    type: LeaderboardEntryDto,
  })
  async getUserScoreForLeaderboard(
    @Param('leaderboardId') leaderboardId: string,
    @Param('username') username: string,
  ) {
    return this.leaderboardsService.getUserScoreForLeaderboard(
      leaderboardId,
      username,
    );
  }
}
