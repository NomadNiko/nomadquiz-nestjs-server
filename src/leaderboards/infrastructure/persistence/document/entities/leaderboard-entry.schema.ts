import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

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
  username: string;

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

// Compound index for leaderboard queries and uniqueness per leaderboard
LeaderboardEntrySchema.index(
  { leaderboardId: 1, username: 1 },
  { unique: true },
);

// Index for leaderboard rankings (sorted by score descending)
LeaderboardEntrySchema.index({ leaderboardId: 1, score: -1 });

// Index for user's entries across all leaderboards
LeaderboardEntrySchema.index({ username: 1, timestamp: -1 });
