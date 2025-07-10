import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveParticipantDto {
  @ApiProperty({
    description: 'The ID of the user to remove from the conversation',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  participantId: string;
}