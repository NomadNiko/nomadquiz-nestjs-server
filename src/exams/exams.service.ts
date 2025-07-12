import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ExamQuestionRepository } from './infrastructure/persistence/exam-question.repository';
import { ExamQuestion } from './domain/exam-question';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { QueryExamQuestionsDto } from './dto/query-exam-questions.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class ExamsService {
  constructor(
    private readonly examQuestionRepository: ExamQuestionRepository,
  ) {}

  async createQuestion(createExamQuestionDto: CreateExamQuestionDto): Promise<ExamQuestion> {
    return this.examQuestionRepository.create(createExamQuestionDto);
  }

  async findAllQuestions(query: QueryExamQuestionsDto): Promise<{
    data: ExamQuestion[];
    page: number;
    limit: number;
  }> {
    const paginationOptions: IPaginationOptions = {
      page: query.page || 0,
      limit: query.limit || 10,
    };

    const data = await this.examQuestionRepository.findManyWithPagination({
      paginationOptions,
      options: {
        examType: query.examType,
        topic: query.topic,
        search: query.search,
        randomize: query.randomize,
      },
    });

    return {
      data,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
    };
  }

  async findQuestionById(id: string): Promise<ExamQuestion> {
    const question = await this.examQuestionRepository.findById(id);
    if (!question) {
      throw new NotFoundException(`Exam question with ID ${id} not found`);
    }
    return question;
  }

  async updateQuestion(id: string, updateExamQuestionDto: UpdateExamQuestionDto): Promise<ExamQuestion> {
    const updatedQuestion = await this.examQuestionRepository.update(id, updateExamQuestionDto);
    if (!updatedQuestion) {
      throw new NotFoundException(`Exam question with ID ${id} not found`);
    }
    return updatedQuestion;
  }

  async removeQuestion(id: string): Promise<void> {
    const question = await this.examQuestionRepository.findById(id);
    if (!question) {
      throw new NotFoundException(`Exam question with ID ${id} not found`);
    }
    await this.examQuestionRepository.remove(id);
  }

  async getRandomQuestions(
    examType: number,
    limit: number,
    topic?: string,
  ): Promise<ExamQuestion[]> {
    if (limit < 1 || limit > 50) {
      throw new BadRequestException('Limit must be between 1 and 50');
    }

    const questions = await this.examQuestionRepository.findRandomQuestions(examType, limit, topic);
    
    if (questions.length === 0) {
      throw new NotFoundException(
        `No questions found for exam type ${examType}${topic ? ` and topic ${topic}` : ''}`
      );
    }

    return questions;
  }

  async getExamStats(examType: number): Promise<{
    totalQuestions: number;
    examType: number;
  }> {
    const totalQuestions = await this.examQuestionRepository.countByExamType(examType);
    return {
      totalQuestions,
      examType,
    };
  }

  // Utility method to get a shuffled array of all answers for a question
  async getQuestionWithShuffledAnswers(id: string): Promise<ExamQuestion & { 
    allAnswers: string[];
    correctAnswerIndex: number;
  }> {
    const question = await this.findQuestionById(id);
    
    // Create array of all answers and shuffle them
    const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
    
    // Fisher-Yates shuffle
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }
    
    // Find the index of the correct answer in the shuffled array
    const correctAnswerIndex = allAnswers.indexOf(question.correctAnswer);
    
    return {
      ...question,
      allAnswers,
      correctAnswerIndex,
    };
  }
}