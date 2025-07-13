import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyBankSchemaClass, StudyBankSchema } from './entities/study-bank.schema';
import { DocumentStudyBankRepository } from './repositories/study-bank.repository';
import { StudyBankRepository } from '../study-bank.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyBankSchemaClass.name, schema: StudyBankSchema },
    ]),
  ],
  providers: [
    {
      provide: StudyBankRepository,
      useClass: DocumentStudyBankRepository,
    },
  ],
  exports: [StudyBankRepository],
})
export class DocumentStudyBankPersistenceModule {}