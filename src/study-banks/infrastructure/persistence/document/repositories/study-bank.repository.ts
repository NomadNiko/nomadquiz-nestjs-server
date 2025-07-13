import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudyBankRepository } from '../../study-bank.repository';
import { StudyBank } from '../../../../domain/study-bank';
import { StudyBankSchemaClass } from '../entities/study-bank.schema';
import { StudyBankMapper } from '../mappers/study-bank.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';

@Injectable()
export class DocumentStudyBankRepository implements StudyBankRepository {
  constructor(
    @InjectModel(StudyBankSchemaClass.name)
    private readonly studyBankModel: Model<StudyBankSchemaClass>,
  ) {}

  async create(
    data: Omit<StudyBank, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<StudyBank> {
    const persistenceModel = StudyBankMapper.toPersistence(data as StudyBank);
    const createData = {
      ...persistenceModel,
      userId: data.userId,
    };
    const createdStudyBank = new this.studyBankModel(createData);
    const studyBankObject = await createdStudyBank.save();
    return StudyBankMapper.toDomain(studyBankObject);
  }

  async findByUserId(userId: StudyBank['userId']): Promise<NullableType<StudyBank>> {
    const entity = await this.studyBankModel
      .findOne({ userId })
      .exec();
    return entity ? StudyBankMapper.toDomain(entity) : null;
  }

  async findById(id: StudyBank['id']): Promise<NullableType<StudyBank>> {
    const entity = await this.studyBankModel
      .findById(id)
      .exec();
    return entity ? StudyBankMapper.toDomain(entity) : null;
  }

  async update(
    id: StudyBank['id'],
    payload: DeepPartial<StudyBank>,
  ): Promise<StudyBank | null> {
    const entity = await this.studyBankModel
      .findByIdAndUpdate(
        id,
        StudyBankMapper.toPersistence(payload as StudyBank),
        { new: true },
      )
      .exec();

    return entity ? StudyBankMapper.toDomain(entity) : null;
  }

  async remove(id: StudyBank['id']): Promise<void> {
    await this.studyBankModel.deleteOne({ _id: id }).exec();
  }

  async addQuestionToStudyBank(
    userId: StudyBank['userId'], 
    questionId: string
  ): Promise<StudyBank> {
    // Find existing study bank or create new one
    let studyBank = await this.studyBankModel.findOne({ userId }).exec();
    
    if (!studyBank) {
      // Create new study bank
      const createData = {
        userId,
        questionIds: [questionId],
      };
      studyBank = new this.studyBankModel(createData);
      await studyBank.save();
    } else {
      // Add question if not already present
      if (!studyBank.questionIds.includes(questionId)) {
        studyBank.questionIds.push(questionId);
        studyBank.updatedAt = new Date();
        await studyBank.save();
      }
    }

    return StudyBankMapper.toDomain(studyBank);
  }

  async removeQuestionFromStudyBank(
    userId: StudyBank['userId'], 
    questionId: string
  ): Promise<StudyBank | null> {
    const studyBank = await this.studyBankModel.findOne({ userId }).exec();
    
    if (!studyBank) {
      return null;
    }

    // Remove question from array
    const questionIndex = studyBank.questionIds.indexOf(questionId);
    if (questionIndex > -1) {
      studyBank.questionIds.splice(questionIndex, 1);
      studyBank.updatedAt = new Date();
      await studyBank.save();
    }

    return StudyBankMapper.toDomain(studyBank);
  }
}