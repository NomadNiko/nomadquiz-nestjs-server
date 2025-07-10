import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
import { Conversation } from '../domain/conversation';
import { User } from '../../users/domain/user';
import { Message } from '../domain/message';

export class ConversationDto extends Conversation {
  @ApiProperty({
    type: () => Message,
    required: false,
    description: 'Last message in the conversation',
  })
  @Type(() => Message)
  @Expose({ groups: ['me', 'admin'] })
  lastMessage?: Message;
}