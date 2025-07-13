import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { StudyBankRepository } from './infrastructure/persistence/study-bank.repository';
import { StudyBank } from './domain/study-bank';
import { AddQuestionToStudyBankDto } from './dto/add-question-to-study-bank.dto';
import { RemoveQuestionFromStudyBankDto } from './dto/remove-question-from-study-bank.dto';

@Injectable()
export class StudyBanksService {
  constructor(
    private readonly studyBankRepository: StudyBankRepository,
  ) {}

  async getStudyBankByUserId(userId: string): Promise<StudyBank> {
    let studyBank = await this.studyBankRepository.findByUserId(userId);
    
    // If user doesn't have a study bank, create an empty one and return it
    if (!studyBank) {
      studyBank = await this.studyBankRepository.create({
        userId,
        questionIds: [],
      });
    }
    
    return studyBank;
  }

  async getStudyBankById(id: string): Promise<StudyBank> {
    const studyBank = await this.studyBankRepository.findById(id);
    if (!studyBank) {
      throw new NotFoundException(`Study bank with ID ${id} not found`);
    }
    return studyBank;
  }

  async addQuestionToStudyBank(
    userId: string, 
    addQuestionDto: AddQuestionToStudyBankDto
  ): Promise<StudyBank> {
    if (!addQuestionDto.questionId || typeof addQuestionDto.questionId !== 'string') {
      throw new BadRequestException('Valid question ID is required');
    }

    return this.studyBankRepository.addQuestionToStudyBank(userId, addQuestionDto.questionId);
  }

  async removeQuestionFromStudyBank(
    userId: string, 
    removeQuestionDto: RemoveQuestionFromStudyBankDto
  ): Promise<StudyBank> {
    if (!removeQuestionDto.questionId || typeof removeQuestionDto.questionId !== 'string') {
      throw new BadRequestException('Valid question ID is required');
    }

    const studyBank = await this.studyBankRepository.removeQuestionFromStudyBank(
      userId, 
      removeQuestionDto.questionId
    );
    
    if (!studyBank) {
      throw new NotFoundException(`Study bank for user ${userId} not found`);
    }
    
    return studyBank;
  }

  // Convenience method for automatic addition of wrong answers
  async addQuestionToStudyBankByQuestionId(
    userId: string, 
    questionId: string
  ): Promise<StudyBank> {
    if (!questionId || typeof questionId !== 'string') {
      throw new BadRequestException('Valid question ID is required');
    }

    return this.studyBankRepository.addQuestionToStudyBank(userId, questionId);
  }

  // Get study bank statistics
  async getStudyBankStats(userId: string): Promise<{
    totalQuestions: number;
    userId: string;
  }> {
    const studyBank = await this.getStudyBankByUserId(userId);
    
    return {
      totalQuestions: studyBank.questionIds ? studyBank.questionIds.length : 0,
      userId,
    };
  }

  async removeStudyBank(id: string): Promise<void> {
    const studyBank = await this.studyBankRepository.findById(id);
    if (!studyBank) {
      throw new NotFoundException(`Study bank with ID ${id} not found`);
    }
    await this.studyBankRepository.remove(id);
  }

  // Clear all questions from study bank but keep the study bank
  async clearStudyBank(userId: string): Promise<StudyBank> {
    const studyBank = await this.studyBankRepository.findByUserId(userId);
    
    if (!studyBank) {
      // Create empty study bank if it doesn't exist
      return this.studyBankRepository.create({
        userId,
        questionIds: [],
      });
    }
    
    // Clear all questions
    const updatedStudyBank = await this.studyBankRepository.update(studyBank.id, {
      questionIds: [],
    });
    
    if (!updatedStudyBank) {
      throw new NotFoundException(`Study bank for user ${userId} not found`);
    }
    
    return updatedStudyBank;
  }
}