import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequestRepository } from '../friend-request.repository';
import { FriendRequestDocumentRepository } from './repositories/friend-request.repository';
import {
  FriendRequestSchemaClass,
  FriendRequestSchema,
} from './entities/friend-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequestSchemaClass.name, schema: FriendRequestSchema },
    ]),
  ],
  providers: [
    {
      provide: FriendRequestRepository,
      useClass: FriendRequestDocumentRepository,
    },
  ],
  exports: [FriendRequestRepository],
})
export class FriendRequestDocumentPersistenceModule {}
