import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExamQuestionSchemaClass } from '../../../../exams/infrastructure/persistence/document/entities/exam-question.schema';
import { ExamType } from '../../../../exams/domain/exam-question';

@Injectable()
export class ExamQuestionsSeedService {
  constructor(
    @InjectModel(ExamQuestionSchemaClass.name)
    private readonly examQuestionModel: Model<ExamQuestionSchemaClass>,
  ) {}

  async run(): Promise<void> {
    // Check if we already have exam questions
    const count = await this.examQuestionModel.countDocuments({
      examType: ExamType.CISSP,
    });

    if (count > 0) {
      console.log('Exam questions already exist, skipping seed...');
      return;
    }

    console.log('Seeding CISSP exam questions...');

    // Sample CISSP questions to demonstrate the structure
    const sampleQuestions = [
      {
        questionContent: 'What is the primary purpose of information security management?',
        correctAnswer: 'To protect information assets from threats and vulnerabilities',
        correctAnswerExplanation: 'Information security management focuses on protecting the confidentiality, integrity, and availability (CIA triad) of information assets through systematic risk management and control implementation.',
        incorrectAnswers: [
          'To increase system performance',
          'To reduce operational costs',
          'To improve user experience'
        ],
        examType: ExamType.CISSP,
        topic: 'Security and Risk Management',
      },
      {
        questionContent: 'Which of the following best describes defense in depth?',
        correctAnswer: 'A security strategy that employs multiple layers of controls',
        correctAnswerExplanation: 'Defense in depth is a layered security approach that uses multiple security controls at different levels to protect assets. If one layer fails, other layers continue to provide protection.',
        incorrectAnswers: [
          'A single strong perimeter security control',
          'Using only technical security controls',
          'Focusing security efforts on the most critical assets only'
        ],
        examType: ExamType.CISSP,
        topic: 'Security Architecture and Engineering',
      },
      {
        questionContent: 'What is the main difference between a vulnerability and a threat?',
        correctAnswer: 'A vulnerability is a weakness, while a threat is a potential danger',
        correctAnswerExplanation: 'A vulnerability is a weakness or flaw in a system that can be exploited, while a threat is any potential danger that could exploit vulnerabilities to cause harm. Risk is the combination of threats, vulnerabilities, and impacts.',
        incorrectAnswers: [
          'A vulnerability is external, while a threat is internal',
          'A vulnerability is intentional, while a threat is accidental',
          'There is no difference between vulnerabilities and threats'
        ],
        examType: ExamType.CISSP,
        topic: 'Security and Risk Management',
      },
    ];

    try {
      await this.examQuestionModel.insertMany(sampleQuestions);
      console.log(`Successfully seeded ${sampleQuestions.length} CISSP exam questions`);
    } catch (error) {
      console.error('Error seeding exam questions:', error);
      throw error;
    }
  }

  // Method to import questions from external files
  async importFromFile(questionsData: any[]): Promise<void> {
    try {
      // Clear existing questions if needed
      // await this.examQuestionModel.deleteMany({ examType: ExamType.CISSP });
      
      await this.examQuestionModel.insertMany(questionsData);
      console.log(`Successfully imported ${questionsData.length} questions`);
    } catch (error) {
      console.error('Error importing questions from file:', error);
      throw error;
    }
  }

  // Method to parse CISSP question/answer files when available
  async parseAndImportCISSPFiles(questionsText: string, answersText: string): Promise<void> {
    // This method will parse the CISSP_EXAM_1_QUESTIONS.txt and CISSP_EXAM_1_ANSWERS.txt
    // Implementation depends on the format of these files
    console.log('Parsing CISSP files...');
    
    // TODO: Implement parsing logic based on file format
    // This is a placeholder for when the actual files are provided
    
    console.log('CISSP file parsing not yet implemented - waiting for file format specification');
  }
}