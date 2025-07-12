import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { ExamType } from '../domain/exam-question';

export class CreateExamQuestionDto {
  @ApiProperty({
    example: 'What is the primary purpose of information security management?',
    description: 'The main question content',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  questionContent: string;

  @ApiProperty({
    example: 'To protect information assets from threats and vulnerabilities',
    description: 'The correct answer to the question',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  correctAnswer: string;

  @ApiProperty({
    example: 'Information security management focuses on protecting the confidentiality, integrity, and availability of information assets through systematic risk management and control implementation.',
    description: 'Detailed explanation of why the correct answer is correct',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  correctAnswerExplanation: string;

  @ApiProperty({
    type: [String],
    example: [
      'To increase system performance',
      'To reduce operational costs',
      'To improve user experience'
    ],
    description: 'Array of exactly 3 incorrect answer options',
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  incorrectAnswers: string[];

  @ApiProperty({
    enum: ExamType,
    example: ExamType.CISSP,
    description: 'Type of exam this question belongs to',
  })
  @IsNotEmpty()
  @IsEnum(ExamType)
  examType: ExamType;

  @ApiPropertyOptional({
    example: 'Security and Risk Management',
    description: 'Optional topic or domain this question covers',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  topic?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/diagram.png',
    description: 'Optional URL to helper image or diagram',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  helperImage?: string;
}