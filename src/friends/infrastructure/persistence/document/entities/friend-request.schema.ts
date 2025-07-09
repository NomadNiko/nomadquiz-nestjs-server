import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { FriendRequestStatus } from '../../../../domain/friend-request';

export type FriendRequestDocument = HydratedDocument<FriendRequestSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FriendRequestSchemaClass extends EntityDocumentHelper {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  requesterId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  recipientId: Types.ObjectId;

  @Prop({
    type: String,
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
    index: true,
  })
  status: FriendRequestStatus;

  @Prop({ type: Date, default: Date.now })
  statusChangedAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(
  FriendRequestSchemaClass,
);

// Create compound indexes for common queries
FriendRequestSchema.index({ requesterId: 1, status: 1 });
FriendRequestSchema.index({ recipientId: 1, status: 1 });
FriendRequestSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });
FriendRequestSchema.index({ createdAt: -1 });
FriendRequestSchema.index({ updatedAt: -1 });
