import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { hash } from 'bcryptjs';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';

describe('Authenticate Deliveryman (E2E)', () => {
  let app: INestApplication;
  let deliverymenFactory: DeliverymenFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymenFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    deliverymenFactory = moduleRef.get(DeliverymenFactory);

    await app.init();
  });

  test('[POST] /deliveryman/sessions', async () => {
    await deliverymenFactory.makePrismaDeliveryman({
      cpf: '789.456.123-00',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer())
      .post('/deliveryman/sessions')
      .send({
        cpf: '789.456.123-00',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
