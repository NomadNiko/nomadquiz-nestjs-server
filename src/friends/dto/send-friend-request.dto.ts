import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class SendFriendRequestDto {
  @ApiProperty({
    type: String,
    example: 'john_doe',
    description: 'Username (or email for users who haven\'t changed their username) of the user to send friend request to',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255) // Increased to support email addresses as usernames
  recipientUsername: string;
}
