import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateConversationDto {
  @ApiProperty({
    type: String,
    description: 'Updated name for the conversation',
    example: 'Project Updates',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}