import { ExamQuestion } from '../../../../domain/exam-question';
import { ExamQuestionSchemaClass } from '../entities/exam-question.schema';

export class ExamQuestionMapper {
  static toDomain(raw: ExamQuestionSchemaClass): ExamQuestion {
    const domainEntity = new ExamQuestion();
    
    // ⚠️ CRITICAL: Always convert ObjectId to string
    domainEntity.id = raw._id.toString();
    domainEntity.questionContent = raw.questionContent;
    domainEntity.correctAnswer = raw.correctAnswer;
    domainEntity.correctAnswerExplanation = raw.correctAnswerExplanation;
    domainEntity.incorrectAnswers = raw.incorrectAnswers;
    domainEntity.examType = raw.examType;
    domainEntity.topic = raw.topic;
    domainEntity.helperImage = raw.helperImage;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    
    return domainEntity;
  }

  static toPersistence(domainEntity: ExamQuestion): Partial<ExamQuestionSchemaClass> {
    const persistenceEntity: Partial<ExamQuestionSchemaClass> = {
      questionContent: domainEntity.questionContent,
      correctAnswer: domainEntity.correctAnswer,
      correctAnswerExplanation: domainEntity.correctAnswerExplanation,
      incorrectAnswers: domainEntity.incorrectAnswers,
      examType: domainEntity.examType,
      topic: domainEntity.topic,
      helperImage: domainEntity.helperImage,
    };

    return persistenceEntity;
  }
}