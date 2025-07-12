import { PartialType } from '@nestjs/swagger';
import { CreateExamQuestionDto } from './create-exam-question.dto';

export class UpdateExamQuestionDto extends PartialType(CreateExamQuestionDto) {}