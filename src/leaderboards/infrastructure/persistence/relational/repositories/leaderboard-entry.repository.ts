import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardEntryRepository } from '../../leaderboard-entry.repository';
import { LeaderboardEntry } from '../../../../domain/leaderboard-entry';
import { LeaderboardEntryEntity } from '../entities/leaderboard-entry.entity';
import { LeaderboardEntryMapper } from '../mappers/leaderboard-entry.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class LeaderboardEntryRelationalRepository extends LeaderboardEntryRepository {
  constructor(
    @InjectRepository(LeaderboardEntryEntity)
    private readonly leaderboardEntryRepository: Repository<LeaderboardEntryEntity>,
  ) {
    super();
  }

  async submitScore(
    data: Omit<LeaderboardEntry, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<LeaderboardEntry> {
    const existingEntry = await this.leaderboardEntryRepository.findOne({
      where: {
        leaderboardId: data.leaderboardId,
        userId: data.userId as number,
      },
    });

    if (existingEntry) {
      // Only update if new score is higher
      if (data.score > existingEntry.score) {
        await this.leaderboardEntryRepository.update(existingEntry.id, {
          score: data.score,
          metadata: data.metadata,
          timestamp: data.timestamp,
        });

        const updatedEntry = await this.leaderboardEntryRepository.findOne({
          where: { id: existingEntry.id },
          relations: ['user'],
        });

        return LeaderboardEntryMapper.toDomain(updatedEntry!);
      } else {
        // Return existing entry without changes
        return LeaderboardEntryMapper.toDomain(existingEntry);
      }
    } else {
      // Create new entry
      const persistenceModel = LeaderboardEntryMapper.toPersistence(data);
      const newEntity = await this.leaderboardEntryRepository.save(
        this.leaderboardEntryRepository.create(persistenceModel),
      );
      return LeaderboardEntryMapper.toDomain(newEntity);
    }
  }

  async findByLeaderboardAndUserId(
    leaderboardId: string,
    userId: LeaderboardEntry['userId'],
  ): Promise<NullableType<LeaderboardEntry>> {
    const entity = await this.leaderboardEntryRepository.findOne({
      where: { leaderboardId, userId: userId as number },
      relations: ['user'],
    });

    return entity ? LeaderboardEntryMapper.toDomain(entity) : null;
  }


  async findByLeaderboard(
    leaderboardId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<LeaderboardEntry[]> {
    const entities = await this.leaderboardEntryRepository.find({
      where: { leaderboardId },
      relations: ['user'],
      order: {
        score: 'DESC',
        timestamp: 'ASC', // Earliest timestamp for ties
      },
      take: paginationOptions.limit,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
    });

    return entities.map((entity) => LeaderboardEntryMapper.toDomain(entity));
  }

  async findByUserId(
    userId: LeaderboardEntry['userId'],
    paginationOptions: IPaginationOptions,
  ): Promise<LeaderboardEntry[]> {
    const entities = await this.leaderboardEntryRepository.find({
      where: { userId: userId as number },
      relations: ['user'],
      order: { timestamp: 'DESC' }, // Most recent first
      take: paginationOptions.limit,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
    });

    return entities.map((entity) => LeaderboardEntryMapper.toDomain(entity));
  }


  async update(
    id: LeaderboardEntry['id'],
    payload: DeepPartial<LeaderboardEntry>,
  ): Promise<LeaderboardEntry | null> {
    const entity = await this.leaderboardEntryRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      return null;
    }

    // Remove the id, userId, and user from payload to avoid conflicts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _payloadId, userId: _userId, user: _user, ...updatePayload } = payload;

    await this.leaderboardEntryRepository.update(Number(id), updatePayload);

    const updatedEntity = await this.leaderboardEntryRepository.findOne({
      where: { id: Number(id) },
    });

    return updatedEntity
      ? LeaderboardEntryMapper.toDomain(updatedEntity)
      : null;
  }

  async countByLeaderboard(leaderboardId: string): Promise<number> {
    return this.leaderboardEntryRepository.count({
      where: { leaderboardId },
    });
  }

  async getAllLeaderboards(): Promise<
    {
      leaderboardId: string;
      entryCount: number;
      topScore: number;
      lastActivity: Date;
    }[]
  > {
    const queryResult = await this.leaderboardEntryRepository
      .createQueryBuilder('entry')
      .select('entry.leaderboardId', 'leaderboardId')
      .addSelect('COUNT(*)', 'entryCount')
      .addSelect('MAX(entry.score)', 'topScore')
      .addSelect('MAX(entry.timestamp)', 'lastActivity')
      .groupBy('entry.leaderboardId')
      .orderBy('lastActivity', 'DESC')
      .getRawMany();

    return queryResult.map((result) => ({
      leaderboardId: result.leaderboardId,
      entryCount: parseInt(result.entryCount, 10),
      topScore: parseInt(result.topScore, 10),
      lastActivity: new Date(result.lastActivity),
    }));
  }

}
