import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { LeaderboardEntry } from '../../domain/leaderboard-entry';

export abstract class LeaderboardEntryRepository {
  abstract submitScore(
    data: Omit<LeaderboardEntry, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<LeaderboardEntry>;

  abstract findByLeaderboardAndUserId(
    leaderboardId: string,
    userId: LeaderboardEntry['userId'],
  ): Promise<NullableType<LeaderboardEntry>>;


  abstract findByLeaderboard(
    leaderboardId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<LeaderboardEntry[]>;

  abstract findByUserId(
    userId: LeaderboardEntry['userId'],
    paginationOptions: IPaginationOptions,
  ): Promise<LeaderboardEntry[]>;


  abstract update(
    id: LeaderboardEntry['id'],
    payload: DeepPartial<LeaderboardEntry>,
  ): Promise<LeaderboardEntry | null>;

  abstract countByLeaderboard(leaderboardId: string): Promise<number>;

  abstract getAllLeaderboards(): Promise<
    {
      leaderboardId: string;
      entryCount: number;
      topScore: number;
      lastActivity: Date;
    }[]
  >;

}
