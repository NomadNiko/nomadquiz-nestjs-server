import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
  let app: TestingModule;

  beforeEach(async () => {
    // Mock environment variables for testing
    process.env.DATABASE_TYPE = 'mongodb';
    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PORT = '27017';
    process.env.DATABASE_PASSWORD = 'test';
    process.env.DATABASE_NAME = 'test';
    process.env.DATABASE_USERNAME = 'test';
    process.env.AUTH_JWT_SECRET = 'test-secret';
    process.env.AUTH_REFRESH_SECRET = 'test-refresh-secret';
    process.env.AUTH_FORGOT_SECRET = 'test-forgot-secret';
    process.env.AUTH_CONFIRM_EMAIL_SECRET = 'test-confirm-secret';

    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
