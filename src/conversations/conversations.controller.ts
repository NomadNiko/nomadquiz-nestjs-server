import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';
import { ConversationDto } from './dto/conversation.dto';
import { MessageDto } from './dto/message.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { Conversation } from './domain/conversation';
import { Message } from './domain/message';
import { User } from '../users/domain/user';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'conversations', version: '1' })
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: 201,
    description: 'The conversation has been successfully created.',
    type: ConversationDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @SerializeOptions({
    groups: ['me'],
  })
  async create(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req: any,
  ): Promise<Conversation> {
    return this.conversationsService.create(
      createConversationDto,
      req.user.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all conversations for the user.',
    type: [ConversationDto],
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async findUserConversations(@Request() req: any): Promise<ConversationDto[]> {
    return this.conversationsService.findUserConversations(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the conversation.',
    type: ConversationDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async findOne(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<Conversation> {
    return this.conversationsService.findOne(id, req.user.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages from a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Return messages from the conversation.',
    schema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: { $ref: '#/components/schemas/MessageDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async getMessages(
    @Param('id') id: string,
    @Query() queryMessagesDto: QueryMessagesDto,
    @Request() req: any,
  ): Promise<{
    messages: Message[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.conversationsService.getMessages(
      id,
      req.user.id,
      queryMessagesDto,
    );
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully sent.',
    type: MessageDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async sendMessage(
    @Param('id') id: string,
    @Body() sendMessageDto: SendMessageDto,
    @Request() req: any,
  ): Promise<Message> {
    return this.conversationsService.sendMessage(id, sendMessageDto, req.user.id);
  }

  @Post(':id/messages/image')
  @ApiOperation({
    summary: 'Send an image message using an existing uploaded image URL',
  })
  @ApiResponse({
    status: 201,
    description: 'The image message has been sent successfully.',
    type: MessageDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async sendImageMessage(
    @Param('id') id: string,
    @Body()
    body: {
      imageUrl: string;
      fileName?: string;
      fileSize?: number;
      content?: string;
    },
    @Request() req: any,
  ): Promise<Message> {
    const sendMessageDto: SendMessageDto = {
      content: body.content || `📷 Shared an image`,
      imageUrl: body.imageUrl,
      fileName: body.fileName,
      fileSize: body.fileSize,
    };

    return this.conversationsService.sendMessage(id, sendMessageDto, req.user.id);
  }

  @Get('users/search')
  @ApiOperation({ summary: 'Search users to start conversations with' })
  @ApiResponse({
    status: 200,
    description: 'Return users matching the search criteria.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
        },
      },
    },
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async searchUsers(@Query('q') searchTerm: string): Promise<User[]> {
    return this.conversationsService.searchUsers(searchTerm || '');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a conversation' })
  @ApiResponse({
    status: 200,
    description: 'The conversation has been successfully updated.',
    type: ConversationDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @Request() req: any,
  ): Promise<Conversation> {
    return this.conversationsService.update(id, updateConversationDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiResponse({
    status: 204,
    description: 'The conversation has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    await this.conversationsService.remove(id, req.user.id);
  }

  @Post(':id/participants')
  @ApiOperation({ summary: 'Add a participant to a conversation' })
  @ApiResponse({
    status: 201,
    description: 'The participant has been successfully added.',
    type: ConversationDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async addParticipant(
    @Param('id') id: string,
    @Body() addParticipantDto: AddParticipantDto,
    @Request() req: any,
  ): Promise<Conversation> {
    return this.conversationsService.addParticipant(
      id,
      addParticipantDto.participantId,
      req.user.id,
    );
  }

  @Delete(':id/participants/:participantId')
  @ApiOperation({ summary: 'Remove a participant from a conversation' })
  @ApiResponse({
    status: 200,
    description: 'The participant has been successfully removed.',
    type: ConversationDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Conversation ID',
  })
  @ApiParam({
    name: 'participantId',
    type: String,
    description: 'Participant ID to remove',
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async removeParticipant(
    @Param('id') id: string,
    @Param('participantId') participantId: string,
    @Request() req: any,
  ): Promise<Conversation> {
    return this.conversationsService.removeParticipant(
      id,
      participantId,
      req.user.id,
    );
  }
}