import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { ExamsService } from './exams.service';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { QueryExamQuestionsDto } from './dto/query-exam-questions.dto';
import { ExamQuestionDto } from './dto/exam-question.dto';
import { ExamType } from './domain/exam-question';

@ApiTags('Exams')
@Controller({
  path: 'exams',
  version: '1',
})
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new exam question (Admin only)' })
  @ApiCreatedResponse({
    description: 'Exam question created successfully',
    type: ExamQuestionDto,
  })
  async createQuestion(@Body() createExamQuestionDto: CreateExamQuestionDto) {
    return this.examsService.createQuestion(createExamQuestionDto);
  }

  @SerializeOptions({
    groups: ['me', 'admin'],
  })
  @Get('questions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get exam questions with filtering and pagination' })
  @ApiOkResponse({
    description: 'Exam questions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ExamQuestionDto' },
        },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllQuestions(@Query() query: QueryExamQuestionsDto) {
    return this.examsService.findAllQuestions(query);
  }

  @SerializeOptions({
    groups: ['me', 'admin'],
  })
  @Get('questions/random')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get random exam questions for practice' })
  @ApiQuery({ name: 'examType', enum: ExamType, required: true })
  @ApiQuery({ name: 'limit', type: 'number', required: false, example: 10 })
  @ApiQuery({ name: 'topic', type: 'string', required: false })
  @ApiOkResponse({
    description: 'Random exam questions retrieved successfully',
    type: [ExamQuestionDto],
  })
  async getRandomQuestions(
    @Query('examType') examType: ExamType,
    @Query('limit') limit?: number,
    @Query('topic') topic?: string,
  ) {
    return this.examsService.getRandomQuestions(
      examType,
      limit || 10,
      topic,
    );
  }

  @SerializeOptions({
    groups: ['me', 'admin'],
  })
  @Get('stats/:examType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get statistics for an exam type' })
  @ApiParam({
    name: 'examType',
    enum: ExamType,
    required: true,
    description: 'Exam type to get stats for',
  })
  @ApiOkResponse({
    description: 'Exam statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalQuestions: { type: 'number' },
        examType: { type: 'number' },
      },
    },
  })
  async getExamStats(@Param('examType') examType: ExamType) {
    return this.examsService.getExamStats(examType);
  }

  @SerializeOptions({
    groups: ['me', 'admin'],
  })
  @Get('questions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific exam question by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Exam question ID',
  })
  @ApiOkResponse({
    description: 'Exam question retrieved successfully',
    type: ExamQuestionDto,
  })
  async findQuestionById(@Param('id') id: string) {
    return this.examsService.findQuestionById(id);
  }

  @SerializeOptions({
    groups: ['me', 'admin'],
  })
  @Get('questions/:id/shuffled')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a question with shuffled answers for practice' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Exam question ID',
  })
  @ApiOkResponse({
    description: 'Exam question with shuffled answers retrieved successfully',
    schema: {
      type: 'object',
      allOf: [
        { $ref: '#/components/schemas/ExamQuestionDto' },
        {
          type: 'object',
          properties: {
            allAnswers: {
              type: 'array',
              items: { type: 'string' },
              description: 'All answers shuffled randomly',
            },
            correctAnswerIndex: {
              type: 'number',
              description: 'Index of correct answer in shuffled array',
            },
          },
        },
      ],
    },
  })
  async getQuestionWithShuffledAnswers(@Param('id') id: string) {
    return this.examsService.getQuestionWithShuffledAnswers(id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @Patch('questions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an exam question (Admin only)' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Exam question ID',
  })
  @ApiOkResponse({
    description: 'Exam question updated successfully',
    type: ExamQuestionDto,
  })
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateExamQuestionDto: UpdateExamQuestionDto,
  ) {
    return this.examsService.updateQuestion(id, updateExamQuestionDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.admin)
  @Delete('questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exam question (Admin only)' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Exam question ID',
  })
  @ApiOkResponse({
    description: 'Exam question deleted successfully',
  })
  async removeQuestion(@Param('id') id: string) {
    return this.examsService.removeQuestion(id);
  }
}