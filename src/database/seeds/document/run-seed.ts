import { NestFactory } from '@nestjs/core';
import { UserSeedService } from './user/user-seed.service';
import { ExamQuestionsSeedService } from './exam-questions/exam-questions-seed.service';

import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(UserSeedService).run();
  await app.get(ExamQuestionsSeedService).run();

  await app.close();
};

void runSeed();
