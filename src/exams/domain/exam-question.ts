import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

// <database-block>
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;
// </database-block>

export enum ExamType {
  CISSP = 1,
}

export class ExamQuestion {
  @ApiProperty({
    type: idType,
  })
  @Expose({ groups: ['me', 'admin'] })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'What is the primary purpose of information security management?',
    description: 'The main question content',
  })
  questionContent: string;

  @ApiProperty({
    type: String,
    example: 'To protect information assets from threats and vulnerabilities',
    description: 'The correct answer to the question',
  })
  correctAnswer: string;

  @ApiProperty({
    type: String,
    example: 'Information security management focuses on protecting the confidentiality, integrity, and availability of information assets through systematic risk management and control implementation.',
    description: 'Detailed explanation of why the correct answer is correct',
  })
  correctAnswerExplanation: string;

  @ApiProperty({
    type: [String],
    example: [
      'To increase system performance',
      'To reduce operational costs',
      'To improve user experience'
    ],
    description: 'Array of 3 incorrect answer options',
  })
  incorrectAnswers: string[];

  @ApiProperty({
    enum: ExamType,
    example: ExamType.CISSP,
    description: 'Type of exam this question belongs to',
  })
  examType: ExamType;

  @ApiPropertyOptional({
    type: String,
    example: 'Security and Risk Management',
    description: 'Optional topic or domain this question covers',
  })
  topic?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://example.com/diagram.png',
    description: 'Optional URL to helper image or diagram',
  })
  helperImage?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}