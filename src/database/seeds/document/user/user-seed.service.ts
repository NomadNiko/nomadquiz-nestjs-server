import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserSchemaClass } from '../../../../users/infrastructure/persistence/document/entities/user.schema';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly model: Model<UserSchemaClass>,
  ) {}

  async run() {
    const users = [
      {
        email: 'admin@nomadsoft.us',
        username: 'admin',
        firstName: 'Super',
        lastName: 'Admin',
        role: RoleEnum.admin,
      },
      {
        email: 'john.doe@nomadsoft.us',
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        role: RoleEnum.user,
      },
      {
        email: 'jane.smith@nomadsoft.us',
        username: 'jane.smith',
        firstName: 'Jane',
        lastName: 'Smith',
        role: RoleEnum.user,
      },
      {
        email: 'bob.wilson@nomadsoft.us',
        username: 'bob.wilson',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: RoleEnum.user,
      },
      {
        email: 'alice.brown@nomadsoft.us',
        username: 'alice.brown',
        firstName: 'Alice',
        lastName: 'Brown',
        role: RoleEnum.user,
      },
      {
        email: 'charlie.davis@nomadsoft.us',
        username: 'charlie.davis',
        firstName: 'Charlie',
        lastName: 'Davis',
        role: RoleEnum.user,
      },
    ];

    for (const userData of users) {
      const existingUser = await this.model.findOne({
        email: userData.email,
      });

      if (!existingUser) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash('secret', salt);

        const data = new this.model({
          email: userData.email,
          username: userData.username,
          password: password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: {
            _id: userData.role.toString(),
          },
          status: {
            _id: StatusEnum.active.toString(),
          },
        });
        await data.save();
      }
    }
  }
}
