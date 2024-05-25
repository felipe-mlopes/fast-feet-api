import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';

describe('Get Deliveryman by ID (E2E)', () => {
  let app: INestApplication;
  let deliverymanFactory: DeliverymenFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymenFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    deliverymanFactory = moduleRef.get(DeliverymenFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /deliveryman', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      name: 'John Doe',
    });

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      name: deliveryman.name,
      role: deliveryman.role,
    });

    const response = await request(app.getHttpServer())
      .get('/deliveryman')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.deliveryman).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      }),
    );
  });
});
