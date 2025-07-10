import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddParticipantDto {
  @ApiProperty({
    type: String,
    description: 'User ID to add to the conversation',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  participantId: string;
}