/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: '*',
      /* origin: [
        '*',
        'http://localhost:4203',
        'http://localhost:4200',
        'http://localhost:9200',
        'http://192.168.0.180:9200',
        'http://192.168.0.181:9200',
        'http://192.168.0.185:4200',
      ], */
    },
  });
  app.use(
    session({
      secret: 'EATSE2023',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    /* origin: [
      '*',
      'http://localhost:4203',
      'http://localhost:4200',
      'http://localhost:9200',
      'http://192.168.0.180:4800',
      'http://192.168.0.181:9200',
      'http://192.168.0.185:4200',
    ], */
  });
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
