import { StudyBank } from '../../../../domain/study-bank';
import { StudyBankSchemaClass } from '../entities/study-bank.schema';

export class StudyBankMapper {
  static toDomain(raw: StudyBankSchemaClass): StudyBank {
    const domainEntity = new StudyBank();
    
    // ⚠️ CRITICAL: Always convert ObjectId to string
    domainEntity.id = raw._id.toString();
    domainEntity.userId = raw.userId;
    domainEntity.questionIds = raw.questionIds || [];
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    
    return domainEntity;
  }

  static toPersistence(domainEntity: StudyBank): Partial<StudyBankSchemaClass> {
    const persistenceEntity: Partial<StudyBankSchemaClass> = {
      questionIds: domainEntity.questionIds || [],
    };

    return persistenceEntity;
  }
}