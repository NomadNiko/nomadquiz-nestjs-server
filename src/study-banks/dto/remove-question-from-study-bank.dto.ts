import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class RemoveQuestionFromStudyBankDto {
  @ApiProperty({
    example: '64a1b2c3d4e5f6789abcdef0',
    description: 'ID of the question to remove from the study bank',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  questionId: string;
}