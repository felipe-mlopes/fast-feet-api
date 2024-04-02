import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Register Deliveryman (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /deliveryman', async () => {
    const response = await request(app.getHttpServer())
      .post('/deliveryman')
      .send({
        name: 'John Doe',
        cpf: '12345678900',
        email: 'johndoe@example.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
