import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ExamQuestion } from '../domain/exam-question';

export class ExamQuestionDto implements Partial<ExamQuestion> {
  @ApiProperty()
  @Expose({ groups: ['me', 'admin'] })
  id: string;

  @ApiProperty()
  questionContent: string;

  @ApiProperty()
  correctAnswer: string;

  @ApiProperty()
  correctAnswerExplanation: string;

  @ApiProperty()
  incorrectAnswers: string[];

  @ApiProperty()
  examType: number;

  @ApiProperty({ required: false })
  topic?: string;

  @ApiProperty({ required: false })
  helperImage?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}