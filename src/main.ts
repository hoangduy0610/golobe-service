import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envFiles } from './commons/Constant';

require('dotenv').config(envFiles);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'debug', 'log', 'verbose'],
  });

  app.use('/swagger-ui.html', basicAuth({
    challenge: true,
    users: { admin: 'admin' },
  }));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({});

  const options = new DocumentBuilder()
    .setTitle('Golobe API')
    .setVersion('1.0')
    .addBearerAuth();

  if (process.env.MODE === 'production') {
    options.addServer("https://");
  } else if (process.env.MODE === 'test') {
    options.addServer("/");
  }

  const document = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('/swagger-ui.html', app, document);
  await app.listen(process.env.PORT || 80);

  Logger.log(`Server is running on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap();