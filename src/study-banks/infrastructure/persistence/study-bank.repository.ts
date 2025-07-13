import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { StudyBank } from '../../domain/study-bank';

export abstract class StudyBankRepository {
  abstract create(
    data: Omit<StudyBank, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<StudyBank>;

  abstract findByUserId(userId: StudyBank['userId']): Promise<NullableType<StudyBank>>;

  abstract findById(id: StudyBank['id']): Promise<NullableType<StudyBank>>;

  abstract update(
    id: StudyBank['id'],
    payload: DeepPartial<StudyBank>,
  ): Promise<StudyBank | null>;

  abstract remove(id: StudyBank['id']): Promise<void>;

  abstract addQuestionToStudyBank(
    userId: StudyBank['userId'], 
    questionId: string
  ): Promise<StudyBank>;

  abstract removeQuestionFromStudyBank(
    userId: StudyBank['userId'], 
    questionId: string
  ): Promise<StudyBank | null>;
}