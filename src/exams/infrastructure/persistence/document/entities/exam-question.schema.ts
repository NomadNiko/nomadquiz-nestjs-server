import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { ExamType } from '../../../../domain/exam-question';

export type ExamQuestionSchemaDocument =
  HydratedDocument<ExamQuestionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ExamQuestionSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
    index: 'text', // Enable text search
  })
  questionContent: string;

  @Prop({
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
  })
  correctAnswer: string;

  @Prop({
    type: String,
    required: true,
    minlength: 20,
    maxlength: 2000,
  })
  correctAnswerExplanation: string;

  @Prop({
    type: [String],
    required: true,
    validate: [
      {
        validator: function(v: string[]) {
          return v && v.length === 3;
        },
        message: 'Exactly 3 incorrect answers are required',
      },
      {
        validator: function(v: string[]) {
          return v.every(answer => answer && answer.length >= 1);
        },
        message: 'Each incorrect answer must be at least 1 character long',
      }
    ],
  })
  incorrectAnswers: string[];

  @Prop({
    type: Number,
    enum: ExamType,
    required: true,
    index: true,
  })
  examType: ExamType;

  @Prop({
    type: String,
    maxlength: 100,
    index: true,
  })
  topic?: string;

  @Prop({
    type: String,
    maxlength: 500,
  })
  helperImage?: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ExamQuestionSchema = SchemaFactory.createForClass(
  ExamQuestionSchemaClass,
);

// Compound index for efficient querying by exam type and topic
ExamQuestionSchema.index({ examType: 1, topic: 1 });

// Text index for search functionality
ExamQuestionSchema.index({ questionContent: 'text', topic: 'text' });

// Index for random sampling
ExamQuestionSchema.index({ examType: 1, _id: 1 });