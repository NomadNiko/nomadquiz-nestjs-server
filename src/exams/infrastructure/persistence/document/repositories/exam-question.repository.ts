import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExamQuestionRepository, ExamQuestionQueryOptions } from '../../exam-question.repository';
import { ExamQuestion } from '../../../../domain/exam-question';
import { ExamQuestionSchemaClass } from '../entities/exam-question.schema';
import { ExamQuestionMapper } from '../mappers/exam-question.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class DocumentExamQuestionRepository implements ExamQuestionRepository {
  constructor(
    @InjectModel(ExamQuestionSchemaClass.name)
    private readonly examQuestionModel: Model<ExamQuestionSchemaClass>,
  ) {}

  async create(
    data: Omit<ExamQuestion, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExamQuestion> {
    const persistenceModel = ExamQuestionMapper.toPersistence(data as ExamQuestion);
    const createdExamQuestion = new this.examQuestionModel(persistenceModel);
    const examQuestionObject = await createdExamQuestion.save();
    return ExamQuestionMapper.toDomain(examQuestionObject);
  }

  async findManyWithPagination({
    paginationOptions,
    options,
  }: {
    paginationOptions: IPaginationOptions;
    options?: ExamQuestionQueryOptions;
  }): Promise<ExamQuestion[]> {
    const where: Record<string, any> = {};

    if (options?.examType) {
      where.examType = options.examType;
    }

    if (options?.topic) {
      where.topic = { $regex: options.topic, $options: 'i' };
    }

    if (options?.search) {
      where.$text = { $search: options.search };
    }

    let query = this.examQuestionModel.find(where);

    // Handle pagination vs randomization
    if (options?.randomize) {
      // For randomization, use enhanced randomization with multiple techniques
      const requestedLimit = paginationOptions.limit || 10;
      const totalCount = await this.examQuestionModel.countDocuments(where);
      
      if (totalCount === 0) {
        return [];
      }

      const actualLimit = Math.min(requestedLimit, totalCount);

      const pipeline: any[] = [
        { $match: where },
        // Add a random field to each document for additional shuffle
        { $addFields: { randomValue: { $rand: {} } } },
        // Sort by the random field first, then sample
        { $sort: { randomValue: 1 } },
        { $sample: { size: actualLimit } },
        // Remove the temporary random field
        { $unset: 'randomValue' }
      ];
      
      const entities = await this.examQuestionModel.aggregate(pipeline);
      // Additional client-side shuffle for extra randomness
      const shuffledEntities = this.shuffleArray(entities);
      return shuffledEntities.map((entity) => ExamQuestionMapper.toDomain(entity));
    } else {
      // Standard pagination
      query = query
        .skip((paginationOptions.page || 0) * (paginationOptions.limit || 10))
        .limit(paginationOptions.limit || 10)
        .sort({ createdAt: -1 });

      const entities = await query.exec();
      return entities.map((entity) => ExamQuestionMapper.toDomain(entity));
    }
  }

  async findById(id: ExamQuestion['id']): Promise<NullableType<ExamQuestion>> {
    const entity = await this.examQuestionModel.findById(id).exec();
    return entity ? ExamQuestionMapper.toDomain(entity) : null;
  }

  async update(
    id: ExamQuestion['id'],
    payload: DeepPartial<ExamQuestion>,
  ): Promise<ExamQuestion | null> {
    const entity = await this.examQuestionModel
      .findByIdAndUpdate(
        id,
        ExamQuestionMapper.toPersistence(payload as ExamQuestion),
        { new: true },
      )
      .exec();

    return entity ? ExamQuestionMapper.toDomain(entity) : null;
  }

  async remove(id: ExamQuestion['id']): Promise<void> {
    await this.examQuestionModel.deleteOne({ _id: id }).exec();
  }

  async countByExamType(examType: number): Promise<number> {
    return this.examQuestionModel.countDocuments({ examType }).exec();
  }

  async findRandomQuestions(
    examType: number,
    limit: number,
    topic?: string,
  ): Promise<ExamQuestion[]> {
    // First, get the total count to ensure we have enough questions
    const matchStage: any = { examType };
    if (topic) {
      matchStage.topic = { $regex: topic, $options: 'i' };
    }

    const totalCount = await this.examQuestionModel.countDocuments(matchStage);
    
    if (totalCount === 0) {
      return [];
    }

    // If we're requesting more questions than available, return all
    const requestedLimit = Math.min(limit, totalCount);

    // Use multiple randomization techniques for better distribution
    const pipeline: any[] = [
      { $match: matchStage },
      // Add a random field to each document for additional shuffle
      { $addFields: { randomValue: { $rand: {} } } },
      // Sort by the random field first, then sample
      { $sort: { randomValue: 1 } },
      { $sample: { size: requestedLimit } },
      // Remove the temporary random field
      { $unset: 'randomValue' }
    ];

    const entities = await this.examQuestionModel.aggregate(pipeline);
    
    // Additional client-side shuffle for extra randomness
    const shuffledEntities = this.shuffleArray(entities);
    
    return shuffledEntities.map((entity) => ExamQuestionMapper.toDomain(entity));
  }

  // Fisher-Yates shuffle algorithm for additional randomization
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}