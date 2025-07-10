import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeaderboardEntryRepository } from '../../leaderboard-entry.repository';
import { LeaderboardEntry } from '../../../../domain/leaderboard-entry';
import {
  LeaderboardEntrySchemaClass,
  LeaderboardEntrySchemaDocument,
} from '../entities/leaderboard-entry.schema';
import { LeaderboardEntryMapper } from '../mappers/leaderboard-entry.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class LeaderboardEntryDocumentRepository extends LeaderboardEntryRepository {
  constructor(
    @InjectModel(LeaderboardEntrySchemaClass.name)
    private readonly leaderboardEntryModel: Model<LeaderboardEntrySchemaDocument>,
  ) {
    super();
  }

  async submitScore(
    data: Omit<LeaderboardEntry, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<LeaderboardEntry> {
    const existingEntry = await this.leaderboardEntryModel.findOne({
      leaderboardId: data.leaderboardId,
      userId: data.userId,
    });

    if (existingEntry) {
      // Only update if new score is higher
      if (data.score > existingEntry.score) {
        existingEntry.score = data.score;
        existingEntry.metadata = data.metadata;
        existingEntry.timestamp = data.timestamp;
        existingEntry.updatedAt = new Date();

        const updatedEntry = await existingEntry.save();
        return LeaderboardEntryMapper.toDomain(updatedEntry);
      } else {
        // Return existing entry without changes
        return LeaderboardEntryMapper.toDomain(existingEntry);
      }
    } else {
      // Create new entry
      const persistenceModel = LeaderboardEntryMapper.toPersistence(data);
      const newEntity = new this.leaderboardEntryModel(persistenceModel);
      const createdEntry = await newEntity.save();
      return LeaderboardEntryMapper.toDomain(createdEntry);
    }
  }

  async findByLeaderboardAndUserId(
    leaderboardId: string,
    userId: LeaderboardEntry['userId'],
  ): Promise<NullableType<LeaderboardEntry>> {
    const leaderboardEntryObject = await this.leaderboardEntryModel
      .findOne({
        leaderboardId,
        userId: userId as string,
      })
      .populate('userId', 'username email firstName lastName photo')
      .exec();

    return leaderboardEntryObject
      ? LeaderboardEntryMapper.toDomain(leaderboardEntryObject)
      : null;
  }


  async findByLeaderboard(
    leaderboardId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<LeaderboardEntry[]> {
    const entries = await this.leaderboardEntryModel
      .find({ leaderboardId })
      .populate('userId', 'username email firstName lastName photo')
      .sort({ score: -1, timestamp: 1 }) // Highest score first, earliest timestamp for ties
      .limit(paginationOptions.limit)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .exec();

    return entries.map((entry) => LeaderboardEntryMapper.toDomain(entry));
  }

  async findByUserId(
    userId: LeaderboardEntry['userId'],
    paginationOptions: IPaginationOptions,
  ): Promise<LeaderboardEntry[]> {
    const entries = await this.leaderboardEntryModel
      .find({ userId: userId as string })
      .populate('userId', 'username email firstName lastName photo')
      .sort({ timestamp: -1 }) // Most recent first
      .limit(paginationOptions.limit)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .exec();

    return entries.map((entry) => LeaderboardEntryMapper.toDomain(entry));
  }


  async update(
    id: LeaderboardEntry['id'],
    payload: DeepPartial<LeaderboardEntry>,
  ): Promise<LeaderboardEntry | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id };
    const entity = await this.leaderboardEntryModel.findOne(filter);

    if (!entity) {
      return null;
    }

    const updatedEntity = await this.leaderboardEntryModel
      .findOneAndUpdate(filter, clonedPayload, { new: true })
      .exec();

    return updatedEntity
      ? LeaderboardEntryMapper.toDomain(updatedEntity)
      : null;
  }

  async countByLeaderboard(leaderboardId: string): Promise<number> {
    return this.leaderboardEntryModel.countDocuments({ leaderboardId });
  }

  async getAllLeaderboards(): Promise<
    {
      leaderboardId: string;
      entryCount: number;
      topScore: number;
      lastActivity: Date;
    }[]
  > {
    const aggregationResult = await this.leaderboardEntryModel.aggregate([
      {
        $group: {
          _id: '$leaderboardId',
          entryCount: { $sum: 1 },
          topScore: { $max: '$score' },
          lastActivity: { $max: '$timestamp' },
        },
      },
      {
        $project: {
          leaderboardId: '$_id',
          entryCount: 1,
          topScore: 1,
          lastActivity: 1,
          _id: 0,
        },
      },
      {
        $sort: { lastActivity: -1 },
      },
    ]);

    return aggregationResult;
  }

}
