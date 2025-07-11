import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConversationRepository } from './infrastructure/persistence/conversation.repository';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { UsersService } from '../users/users.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from './domain/conversation';
import { Message } from './domain/message';
import { ConversationDto } from './dto/conversation.dto';
import { User } from '../users/domain/user';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
    currentUserId: string,
  ): Promise<Conversation> {
    const { participantIds, name } = createConversationDto;

    // Add current user to participants if not already included
    const allParticipantIds = [...new Set([...participantIds, currentUserId])];

    // Validate all participant IDs exist
    const participants = await Promise.all(
      allParticipantIds.map((id) => this.usersService.findById(id)),
    );

    const validParticipants = participants.filter(Boolean) as User[];
    if (validParticipants.length !== allParticipantIds.length) {
      throw new BadRequestException('One or more participant IDs are invalid');
    }

    // Check if a conversation with exact same participants already exists
    const existingConversation =
      await this.conversationRepository.findByParticipants(allParticipantIds);

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = new Conversation();
    conversation.participants = validParticipants;
    conversation.name = name;
    conversation.lastMessageAt = new Date();

    return this.conversationRepository.create(conversation);
  }

  async findUserConversations(userId: string): Promise<ConversationDto[]> {
    const conversations =
      await this.conversationRepository.findUserConversations(userId);

    // Add last message and full participant data to each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage =
          await this.messageRepository.findLastMessageByConversation(
            conversation.id as string,
          );

        // Get full participant data
        const participantsWithData = await Promise.all(
          conversation.participants.map(async (participant) => {
            const fullUser = await this.usersService.findById(participant.id);
            return fullUser || participant;
          })
        );

        const conversationDto = new ConversationDto();
        Object.assign(conversationDto, conversation);
        conversationDto.participants = participantsWithData;
        conversationDto.lastMessage = lastMessage || undefined;

        return conversationDto;
      }),
    );

    return conversationsWithLastMessage;
  }

  async findOne(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findById(
      conversationId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Ensure user is part of conversation
    const isParticipant = conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      throw new NotFoundException(
        'Conversation not found or you do not have access to it',
      );
    }

    // Get full participant data
    const participantsWithData = await Promise.all(
      conversation.participants.map(async (participant) => {
        const fullUser = await this.usersService.findById(participant.id);
        return fullUser || participant;
      })
    );

    conversation.participants = participantsWithData;

    return conversation;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    queryMessagesDto: QueryMessagesDto,
  ): Promise<{
    messages: Message[];
    total: number;
    page: number;
    limit: number;
  }> {
    // First verify user has access to conversation
    await this.findOne(conversationId, userId);

    const { page = 1, limit = 20 } = queryMessagesDto;

    const [messages, total] = await Promise.all([
      this.messageRepository.findByConversation(conversationId, {
        page,
        limit,
      }),
      this.messageRepository.countByConversation(conversationId),
    ]);

    // Reverse messages to show oldest first in page
    return {
      messages: messages.reverse(),
      total,
      page,
      limit,
    };
  }

  async sendMessage(
    conversationId: string,
    sendMessageDto: SendMessageDto,
    senderId: string,
  ): Promise<Message> {
    // Verify user has access to conversation
    await this.findOne(conversationId, senderId);

    // Get sender user
    const sender = await this.usersService.findById(senderId);
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    // Create the message
    const message = new Message();
    message.conversationId = conversationId;
    message.senderId = sender;
    message.content = sendMessageDto.content;
    message.imageUrl = sendMessageDto.imageUrl;
    message.fileName = sendMessageDto.fileName;
    message.fileSize = sendMessageDto.fileSize;
    message.timestamp = new Date();
    message.type = 'user';

    const savedMessage = await this.messageRepository.create(message);

    // Update conversation's lastMessageAt
    await this.conversationRepository.update(conversationId, {
      lastMessageAt: new Date(),
    });

    return savedMessage;
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const paginatedUsers = await this.usersService.findManyWithPagination({
      filterOptions: { search: searchTerm.trim() },
      sortOptions: null,
      paginationOptions: {
        page: 1,
        limit: 20,
      },
    });

    return paginatedUsers;
  }

  async update(
    conversationId: string,
    updateData: UpdateConversationDto,
    userId: string,
  ): Promise<Conversation> {
    // Verify user has access to conversation
    await this.findOne(conversationId, userId);

    const updatedConversation = await this.conversationRepository.update(
      conversationId,
      updateData,
    );

    if (!updatedConversation) {
      throw new NotFoundException('Failed to update conversation');
    }

    return updatedConversation;
  }

  async remove(conversationId: string, userId: string): Promise<void> {
    // Verify user has access to conversation
    await this.findOne(conversationId, userId);

    // Delete all messages in the conversation
    await this.messageRepository.deleteByConversation(conversationId);

    // Delete the conversation
    await this.conversationRepository.softDelete(conversationId);
  }

  async addParticipant(
    conversationId: string,
    participantId: string,
    currentUserId: string,
  ): Promise<Conversation> {
    // Verify user has access to conversation
    const conversation = await this.findOne(conversationId, currentUserId);

    // Check if participant is already in the conversation
    if (conversation.participants.some((p) => p.id === participantId)) {
      throw new BadRequestException(
        'User is already a participant in this conversation',
      );
    }

    // Get the participant user
    const participant = await this.usersService.findById(participantId);
    if (!participant) {
      throw new NotFoundException('Participant user not found');
    }

    // Add participant to conversation - pass User objects like in create method
    const updatedParticipants = [...conversation.participants, participant];
    
    const updatedConversation = await this.conversationRepository.update(
      conversationId,
      {
        participants: updatedParticipants,
        lastMessageAt: new Date(),
      },
    );

    if (!updatedConversation) {
      throw new NotFoundException('Failed to update conversation');
    }

    // Create system message announcing the addition
    const userName =
      participant.firstName && participant.lastName
        ? `${participant.firstName} ${participant.lastName}`
        : participant.email;

    const systemMessage = new Message();
    systemMessage.conversationId = conversationId;
    systemMessage.content = `${userName} was added to the chat!`;
    systemMessage.type = 'system';
    systemMessage.timestamp = new Date();

    await this.messageRepository.create(systemMessage);

    return updatedConversation;
  }

  async removeParticipant(
    conversationId: string,
    participantId: string,
    currentUserId: string,
  ): Promise<Conversation> {
    // Verify user has access to conversation
    const conversation = await this.findOne(conversationId, currentUserId);

    // Check if participant is actually in the conversation
    if (!conversation.participants.some((p) => p.id === participantId)) {
      throw new BadRequestException(
        'User is not a participant in this conversation',
      );
    }

    // Prevent removing the last participant
    if (conversation.participants.length <= 1) {
      throw new BadRequestException(
        'Cannot remove the last participant from a conversation',
      );
    }

    // Remove participant from conversation - pass User objects like in create method
    const updatedParticipants = conversation.participants.filter(
      (p) => p.id !== participantId,
    );
    const updatedConversation = await this.conversationRepository.update(
      conversationId,
      {
        participants: updatedParticipants,
        lastMessageAt: new Date(),
      },
    );

    if (!updatedConversation) {
      throw new NotFoundException('Failed to update conversation');
    }

    return updatedConversation;
  }
}