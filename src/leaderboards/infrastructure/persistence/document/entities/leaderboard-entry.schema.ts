import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';

export type LeaderboardEntrySchemaDocument =
  HydratedDocument<LeaderboardEntrySchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class LeaderboardEntrySchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  leaderboardId: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  userId: string;

  // username removed - entries tied to userId only

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  score: number;

  @Prop({
    type: Object,
    default: {},
  })
  metadata?: Record<string, any>;

  @Prop({
    default: now,
    index: true,
  })
  timestamp: Date;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const LeaderboardEntrySchema = SchemaFactory.createForClass(
  LeaderboardEntrySchemaClass,
);

// Virtual populate for user data
LeaderboardEntrySchema.virtual('user', {
  ref: 'UserSchemaClass',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Compound index for leaderboard queries and uniqueness per leaderboard
LeaderboardEntrySchema.index(
  { leaderboardId: 1, userId: 1 },
  { unique: true },
);

// Index for leaderboard rankings (sorted by score descending)
LeaderboardEntrySchema.index({ leaderboardId: 1, score: -1 });

// Index for user's entries across all leaderboards
LeaderboardEntrySchema.index({ userId: 1, timestamp: -1 });

// Temporary index for username during migration
LeaderboardEntrySchema.index({ username: 1 });
