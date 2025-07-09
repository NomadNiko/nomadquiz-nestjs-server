import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FriendsService } from './friends.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { QueryFriendRequestsDto } from './dto/query-friend-requests.dto';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequest } from './domain/friend-request';
import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';
import { infinityPagination } from '../utils/infinity-pagination';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UserSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

@ApiTags('Friends')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'friends',
  version: '1',
})
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('requests')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Friend request sent successfully',
    type: FriendRequest,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async sendFriendRequest(
    @Body() sendFriendRequestDto: SendFriendRequestDto,
    @Request() request: any,
  ): Promise<FriendRequest> {
    const user = request.user as User;
    return this.friendsService.sendFriendRequest(
      user.id,
      sendFriendRequestDto.recipientUsername,
    );
  }

  @Get('requests/sent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get sent pending friend requests' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sent pending friend requests',
    type: [FriendRequestDto],
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async getSentRequests(
    @Query() query: QueryFriendRequestsDto,
    @Request() request: any,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const user = request.user as User;
    return this.friendsService.getPendingSentRequests(user.id, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @Get('requests/received')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get received pending friend requests' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of received pending friend requests',
    type: [FriendRequestDto],
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async getReceivedRequests(
    @Query() query: QueryFriendRequestsDto,
    @Request() request: any,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const user = request.user as User;
    return this.friendsService.getPendingReceivedRequests(user.id, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @Patch('requests/:requestId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friend request accepted',
    type: FriendRequest,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async acceptFriendRequest(
    @Param('requestId') requestId: string,
    @Request() request: any,
  ): Promise<FriendRequest> {
    const user = request.user as User;
    return this.friendsService.acceptFriendRequest(user.id, requestId);
  }

  @Patch('requests/:requestId/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a friend request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Friend request rejected',
    type: FriendRequest,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async rejectFriendRequest(
    @Param('requestId') requestId: string,
    @Request() request: any,
  ): Promise<FriendRequest> {
    const user = request.user as User;
    return this.friendsService.rejectFriendRequest(user.id, requestId);
  }

  @Delete('requests/:requestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a sent friend request' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Friend request cancelled',
  })
  async cancelFriendRequest(
    @Param('requestId') requestId: string,
    @Request() request: any,
  ): Promise<void> {
    const user = request.user as User;
    return this.friendsService.cancelFriendRequest(user.id, requestId);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get current user's friends list" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of friends',
    type: [FriendRequestDto],
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async getFriendsList(
    @Query() query: QueryFriendRequestsDto,
    @Request() request: any,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const user = request.user as User;
    return this.friendsService.getFriendsList(user.id, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @Get('users/:userId/friends')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get another user's friends list" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of user's friends",
    type: [FriendRequestDto],
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async getUserFriendsList(
    @Param('userId') userId: string,
    @Query() query: QueryFriendRequestsDto,
  ): Promise<{
    data: FriendRequestDto[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    return this.friendsService.getUserFriendsList(userId, {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search for users to add as friends' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users matching search criteria',
    type: InfinityPaginationResponse(User),
  })
  @SerializeOptions({
    groups: ['me'],
  })
  async searchUsers(
    @Query() query: UserSearchDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    console.log('🔍 Search endpoint called with query:', query);
    
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    // Only search if search term is provided and at least 2 characters
    if (!query.search || query.search.trim().length < 2) {
      console.log('⚠️ Search term too short or empty:', query.search);
      return infinityPagination([], { page, limit });
    }

    console.log('📊 Searching for users with term:', query.search.trim());
    
    const results = await this.usersService.findManyWithPagination({
      filterOptions: { search: query.search.trim() },
      sortOptions: null,
      paginationOptions: {
        page,
        limit,
      },
    });

    console.log('📋 Search results:', results.length, 'users found');
    
    return infinityPagination(results, { page, limit });
  }
}
