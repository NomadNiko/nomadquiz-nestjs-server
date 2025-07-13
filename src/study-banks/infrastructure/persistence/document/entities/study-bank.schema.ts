import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type StudyBankSchemaDocument = HydratedDocument<StudyBankSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class StudyBankSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    required: true,
    index: true,
    unique: true, // Each user can only have one study bank
  })
  userId: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return Array.isArray(v);
      },
      message: 'questionIds must be an array',
    },
  })
  questionIds: string[];

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const StudyBankSchema = SchemaFactory.createForClass(StudyBankSchemaClass);

// Index for efficient querying by user
StudyBankSchema.index({ userId: 1 });

// Compound index for efficient operations
StudyBankSchema.index({ userId: 1, updatedAt: -1 });