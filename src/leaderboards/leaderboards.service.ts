import { Injectable } from '@nestjs/common';
import { LeaderboardEntryRepository } from './infrastructure/persistence/leaderboard-entry.repository';
import { LeaderboardEntry } from './domain/leaderboard-entry';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { QueryLeaderboardDto } from './dto/query-leaderboard.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class LeaderboardsService {
  constructor(
    private readonly leaderboardEntryRepository: LeaderboardEntryRepository,
  ) {}

  async submitScore(submitScoreDto: SubmitScoreDto): Promise<LeaderboardEntry> {
    const scoreData = {
      leaderboardId: submitScoreDto.leaderboardId,
      username: submitScoreDto.username,
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

    const data = await this.leaderboardEntryRepository.findByUsername(
      username,
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
    return this.leaderboardEntryRepository.findByLeaderboardAndUsername(
      leaderboardId,
      username,
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
