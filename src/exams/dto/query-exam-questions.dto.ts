import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ExamType } from '../domain/exam-question';

export class QueryExamQuestionsDto {
  @ApiPropertyOptional({
    enum: ExamType,
    description: 'Filter by exam type',
  })
  @IsOptional()
  @IsEnum(ExamType)
  @Transform(({ value }) => (value ? Number(value) : value))
  examType?: ExamType;

  @ApiPropertyOptional({
    description: 'Filter by topic',
  })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({
    description: 'Search in question content',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of questions to return (for random selection)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
    description: 'Number of questions to skip',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({
    description: 'Whether to randomize the order of questions',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  randomize?: boolean = false;
}