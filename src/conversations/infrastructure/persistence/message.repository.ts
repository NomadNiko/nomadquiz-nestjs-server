import { Message } from '../../domain/message';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class MessageRepository {
  abstract create(data: Message): Promise<Message>;

  abstract findById(id: Message['id']): Promise<NullableType<Message>>;

  abstract findByConversation(
    conversationId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Message[]>;

  abstract countByConversation(conversationId: string): Promise<number>;

  abstract findLastMessageByConversation(
    conversationId: string,
  ): Promise<NullableType<Message>>;

  abstract deleteByConversation(conversationId: string): Promise<void>;
}