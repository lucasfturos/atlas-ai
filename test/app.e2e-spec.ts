import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';
import { AppModule } from '../src/app.module';

jest.mock('../src/ai/providers/gemini.provider', () => {
  return {
    GeminiProvider: jest.fn().mockImplementation(() => ({
      generate: jest.fn().mockResolvedValue('mocked response'),
    })),
  };
});

describe('Chat API (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;
  });

  it('/v1/chat (POST) should return 400 for invalid provider', async () => {
    await request(server)
      .post('/v1/chat')
      .send({
        provider: 'invalid',
        model: 'any',
        messages: [{ role: 'user', content: 'test' }],
      })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
