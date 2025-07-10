import { Injectable } from '@nestjs/common';
import { LeaderboardEntryRepository } from './infrastructure/persistence/leaderboard-entry.repository';
import { LeaderboardEntry } from './domain/leaderboard-entry';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { QueryLeaderboardDto } from './dto/query-leaderboard.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';

@Injectable()
export class LeaderboardsService {
  constructor(
    private readonly leaderboardEntryRepository: LeaderboardEntryRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async submitScore(submitScoreDto: SubmitScoreDto, userId: string | number): Promise<LeaderboardEntry> {
    // Get the user to ensure username matches the authenticated user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const scoreData = {
      leaderboardId: submitScoreDto.leaderboardId,
      userId, // Only store userId - no username
      score: submitScoreDto.score,
      metadata: submitScoreDto.metadata || {},
      timestamp: new Date(),
    };

    return this.leaderboardEntryRepository.submitScore(scoreData);
  }

  async getLeaderboard(
    leaderboardId: string,
    query: QueryLeaderboardDto,
  ): Promise<{
    data: LeaderboardEntry[];
    total: number;
    page: number;
    limit: number;
  }> {
    const paginationOptions: IPaginationOptions = {
      page: query.page || 1,
      limit: query.limit || 10,
    };

    const [data, total] = await Promise.all([
      this.leaderboardEntryRepository.findByLeaderboard(
        leaderboardId,
        paginationOptions,
      ),
      this.leaderboardEntryRepository.countByLeaderboard(leaderboardId),
    ]);

    return {
      data,
      total,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
  }

  async getUserEntries(
    username: string,
    query: QueryLeaderboardDto,
  ): Promise<{
    data: LeaderboardEntry[];
    page: number;
    limit: number;
  }> {
    const paginationOptions: IPaginationOptions = {
      page: query.page || 1,
      limit: query.limit || 10,
    };

    // Find user by username, then get entries by userId
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return {
        data: [],
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      };
    }

    const data = await this.leaderboardEntryRepository.findByUserId(
      user.id,
      paginationOptions,
    );

    return {
      data,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
  }


  async getUserScoreForLeaderboard(
    leaderboardId: string,
    username: string,
  ): Promise<LeaderboardEntry | null> {
    // Find user by username, then get score by userId
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    return this.leaderboardEntryRepository.findByLeaderboardAndUserId(
      leaderboardId,
      user.id,
    );
  }

  async getAllLeaderboards(): Promise<
    {
      leaderboardId: string;
      entryCount: number;
      topScore: number;
      lastActivity: Date;
    }[]
  > {
    return this.leaderboardEntryRepository.getAllLeaderboards();
  }
}
