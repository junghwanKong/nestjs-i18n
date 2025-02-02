import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from '../src/lib';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';

describe('i18n module e2e express', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          path: path.join(__dirname, '/i18n/'),
          fallbackLanguage: 'en',
          saveMissing: false,
          resolvers: [
            new QueryResolver(['lang', 'locale', 'l']),
            new HeaderResolver(),
            new CookieResolver(),
          ],
        }),
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`/GET hello should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello should return right language when using query resolver`, () => {
    return request(app.getHttpServer())
      .get('/hello?lang=nl')
      .expect(200)
      .expect('Hallo')
      .then(() =>
        request(app.getHttpServer())
          .get('/hello?l=nl')
          .expect(200)
          .expect('Hallo'),
      );
  });

  it(`/GET hello should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('accept-language', 'nl')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello should return translation when providing cookie`, () => {
    return request(app.getHttpServer())
      .get('/hello')
      .set('Cookie', ['lang=nl'])
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/context should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/context should return right language when using query resolver`, () => {
    return request(app.getHttpServer())
      .get('/hello/context?lang=nl')
      .expect(200)
      .expect('Hallo')
      .then(() =>
        request(app.getHttpServer())
          .get('/hello/context?l=nl')
          .expect(200)
          .expect('Hallo'),
      );
  });

  it(`/GET hello/context should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('accept-language', 'nl')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/context should return translation when providing cookie`, () => {
    return request(app.getHttpServer())
      .get('/hello/context')
      .set('Cookie', ['lang=nl'])
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/request-scope should return translation`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .expect(200)
      .expect('Hello');
  });

  it(`/GET hello/request-scope should return right language when using query resolver`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope?lang=nl')
      .expect(200)
      .expect('Hallo')
      .then(() =>
        request(app.getHttpServer())
          .get('/hello/request-scope?l=nl')
          .expect(200)
          .expect('Hallo'),
      );
  });

  it(`/GET hello/request-scope should return translation when providing accept-language`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('accept-language', 'nl')
      .expect(200)
      .expect('Hallo');
  });

  it(`/GET hello/request-scope should return translation when providing cookie`, () => {
    return request(app.getHttpServer())
      .get('/hello/request-scope')
      .set('Cookie', ['lang=nl'])
      .expect(200)
      .expect('Hallo');
  });

  afterAll(async () => {
    await app.close();
  });
});
