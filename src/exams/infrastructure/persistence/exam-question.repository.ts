import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { ExamQuestion } from '../../domain/exam-question';

export interface ExamQuestionQueryOptions {
  examType?: number;
  topic?: string;
  search?: string;
  randomize?: boolean;
}

export abstract class ExamQuestionRepository {
  abstract create(
    data: Omit<ExamQuestion, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExamQuestion>;

  abstract findManyWithPagination({
    paginationOptions,
    options,
  }: {
    paginationOptions: IPaginationOptions;
    options?: ExamQuestionQueryOptions;
  }): Promise<ExamQuestion[]>;

  abstract findById(id: ExamQuestion['id']): Promise<NullableType<ExamQuestion>>;

  abstract update(
    id: ExamQuestion['id'],
    payload: DeepPartial<ExamQuestion>,
  ): Promise<ExamQuestion | null>;

  abstract remove(id: ExamQuestion['id']): Promise<void>;

  abstract countByExamType(examType: number): Promise<number>;

  abstract findRandomQuestions(
    examType: number,
    limit: number,
    topic?: string,
  ): Promise<ExamQuestion[]>;
}