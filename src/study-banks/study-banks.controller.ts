import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StudyBanksService } from './study-banks.service';
import { AddQuestionToStudyBankDto } from './dto/add-question-to-study-bank.dto';
import { RemoveQuestionFromStudyBankDto } from './dto/remove-question-from-study-bank.dto';
import { StudyBankDto } from './dto/study-bank.dto';

@ApiTags('Study Banks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'study-banks',
  version: '1',
})
export class StudyBanksController {
  constructor(private readonly studyBanksService: StudyBanksService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('my-study-bank')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user\'s study bank' })
  @ApiOkResponse({
    description: 'User study bank retrieved successfully',
    type: StudyBankDto,
  })
  async getMyStudyBank(@Request() request: any) {
    const userId = request.user.id;
    return this.studyBanksService.getStudyBankByUserId(userId);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('my-study-bank/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get statistics for current user\'s study bank' })
  @ApiOkResponse({
    description: 'Study bank statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalQuestions: { type: 'number' },
        userId: { type: 'string' },
      },
    },
  })
  async getMyStudyBankStats(@Request() request: any) {
    const userId = request.user.id;
    return this.studyBanksService.getStudyBankStats(userId);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('my-study-bank/questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a question to current user\'s study bank' })
  @ApiCreatedResponse({
    description: 'Question added to study bank successfully',
    type: StudyBankDto,
  })
  async addQuestionToMyStudyBank(
    @Request() request: any,
    @Body() addQuestionDto: AddQuestionToStudyBankDto,
  ) {
    const userId = request.user.id;
    return this.studyBanksService.addQuestionToStudyBank(userId, addQuestionDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Delete('my-study-bank/questions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a question from current user\'s study bank' })
  @ApiOkResponse({
    description: 'Question removed from study bank successfully',
    type: StudyBankDto,
  })
  async removeQuestionFromMyStudyBank(
    @Request() request: any,
    @Body() removeQuestionDto: RemoveQuestionFromStudyBankDto,
  ) {
    const userId = request.user.id;
    return this.studyBanksService.removeQuestionFromStudyBank(userId, removeQuestionDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Delete('my-study-bank/clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear all questions from current user\'s study bank' })
  @ApiOkResponse({
    description: 'Study bank cleared successfully',
    type: StudyBankDto,
  })
  async clearMyStudyBank(@Request() request: any) {
    const userId = request.user.id;
    return this.studyBanksService.clearStudyBank(userId);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific study bank by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Study bank ID',
  })
  @ApiOkResponse({
    description: 'Study bank retrieved successfully',
    type: StudyBankDto,
  })
  async findStudyBankById(@Param('id') id: string) {
    return this.studyBanksService.getStudyBankById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a study bank by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Study bank ID',
  })
  @ApiOkResponse({
    description: 'Study bank deleted successfully',
  })
  async removeStudyBank(@Param('id') id: string) {
    return this.studyBanksService.removeStudyBank(id);
  }
}