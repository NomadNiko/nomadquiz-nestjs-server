import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class SendFriendRequestDto {
  @ApiProperty({
    type: String,
    example: 'john_doe',
    description: 'Username of the user to send friend request to',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  recipientUsername: string;
}
