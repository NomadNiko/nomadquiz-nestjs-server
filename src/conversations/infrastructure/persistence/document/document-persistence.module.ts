import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationSchemaClass,
  ConversationSchema,
} from './entities/conversation.schema';
import { MessageSchemaClass, MessageSchema } from './entities/message.schema';
import { ConversationRepository } from '../conversation.repository';
import { ConversationDocumentRepository } from './repositories/conversation.repository';
import { MessageRepository } from '../message.repository';
import { MessageDocumentRepository } from './repositories/message.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ConversationSchemaClass.name,
        schema: ConversationSchema,
      },
      {
        name: MessageSchemaClass.name,
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: ConversationRepository,
      useClass: ConversationDocumentRepository,
    },
    {
      provide: MessageRepository,
      useClass: MessageDocumentRepository,
    },
  ],
  exports: [ConversationRepository, MessageRepository],
})
export class DocumentConversationPersistenceModule {}