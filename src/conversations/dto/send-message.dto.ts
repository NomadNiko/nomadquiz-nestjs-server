import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    type: String,
    description: 'Content of the message',
    example: 'Hello, how are you?',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'URL of attached image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Name of attached file',
  })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Size of attached file in bytes',
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}