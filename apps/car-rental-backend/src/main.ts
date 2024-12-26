import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('Car Rental API').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  const globalPrefix = 'api';
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
