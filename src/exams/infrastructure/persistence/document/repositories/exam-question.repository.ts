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
      // For randomization, use MongoDB's $sample aggregation
      const pipeline = [
        { $match: where },
        { $sample: { size: paginationOptions.limit || 10 } }
      ];
      const entities = await this.examQuestionModel.aggregate(pipeline);
      return entities.map((entity) => ExamQuestionMapper.toDomain(entity));
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
    const pipeline: any[] = [
      { $match: { examType } }
    ];

    if (topic) {
      pipeline[0].$match.topic = { $regex: topic, $options: 'i' };
    }

    pipeline.push({ $sample: { size: limit } });

    const entities = await this.examQuestionModel.aggregate(pipeline);
    return entities.map((entity) => ExamQuestionMapper.toDomain(entity));
  }
}