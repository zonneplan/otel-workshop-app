import 'dotenv/config';
import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {AppModule} from './app/app.module';
import {BatteryInstructionStatusConsumerService} from "./app/services/battery-instruction-status-consumer.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Control API')
    .setDescription('The API specification for the control API.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.get(BatteryInstructionStatusConsumerService).run();

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
