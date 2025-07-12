import { MongoClient } from 'mongodb';
import { ExamType } from '../../../exams/domain/exam-question';

async function seedExamQuestions() {
  const uri = "mongodb+srv://nomadniko:123QWEasd@cluster0.vf9ss.mongodb.net/nestjs-server01?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db('nestjs-server01');
    const examQuestions = database.collection('examquestionschemaclasses');

    // Check if we already have data
    const count = await examQuestions.countDocuments({ examType: ExamType.CISSP });
    if (count > 0) {
      console.log(`Found ${count} existing CISSP questions, skipping seed...`);
      return;
    }

    // Sample CISSP questions
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionContent: 'What is the principle of least privilege?',
        correctAnswer: 'Granting users only the minimum access required to perform their job functions',
        correctAnswerExplanation: 'The principle of least privilege states that users should be given only the minimum levels of access or permissions necessary to perform their job functions. This reduces the risk of accidental or intentional misuse.',
        incorrectAnswers: [
          'Giving administrators full access to all systems',
          'Restricting all users from accessing sensitive data',
          'Providing temporary elevated access to all users'
        ],
        examType: ExamType.CISSP,
        topic: 'Identity and Access Management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        questionContent: 'Which cryptographic algorithm is considered symmetric?',
        correctAnswer: 'AES (Advanced Encryption Standard)',
        correctAnswerExplanation: 'AES is a symmetric encryption algorithm where the same key is used for both encryption and decryption. It is widely used for securing sensitive data and is considered highly secure when properly implemented.',
        incorrectAnswers: [
          'RSA (Rivest-Shamir-Adleman)',
          'DSA (Digital Signature Algorithm)',
          'ECC (Elliptic Curve Cryptography)'
        ],
        examType: ExamType.CISSP,
        topic: 'Security Architecture and Engineering',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await examQuestions.insertMany(sampleQuestions);
    console.log(`Successfully seeded ${result.insertedCount} CISSP exam questions`);

  } catch (error) {
    console.error('Error seeding exam questions:', error);
  } finally {
    await client.close();
  }
}

// Run the seed
seedExamQuestions().catch(console.error);