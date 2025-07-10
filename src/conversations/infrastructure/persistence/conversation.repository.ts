import { Conversation } from '../../domain/conversation';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class ConversationRepository {
  abstract create(data: Conversation): Promise<Conversation>;

  abstract findById(id: Conversation['id']): Promise<NullableType<Conversation>>;

  abstract findByParticipants(
    participantIds: string[],
  ): Promise<NullableType<Conversation>>;

  abstract findUserConversations(
    userId: string,
  ): Promise<Conversation[]>;

  abstract update(
    id: Conversation['id'],
    payload: Partial<Conversation>,
  ): Promise<NullableType<Conversation>>;

  abstract softDelete(id: Conversation['id']): Promise<void>;
}