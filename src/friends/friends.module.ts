import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendRequestManagementService } from './services/friend-request-management.service';
import { FriendRequestResponseService } from './services/friend-request-response.service';
import { FriendQueryService } from './services/friend-query.service';
import { FriendRequestDocumentPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { UsersModule } from '../users/users.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? FriendRequestDocumentPersistenceModule
  : FriendRequestDocumentPersistenceModule; // Only document DB supported for now

@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  controllers: [FriendsController],
  providers: [
    FriendsService,
    FriendRequestManagementService,
    FriendRequestResponseService,
    FriendQueryService,
  ],
  exports: [FriendsService],
})
export class FriendsModule {}
