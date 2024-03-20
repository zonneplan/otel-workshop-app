import otel = require('@zonneplan/open-telemetry-node');
import stb = require("@opentelemetry/sdk-trace-base");
import etoh = require("@opentelemetry/exporter-trace-otlp-http");
import ain = require("@opentelemetry/auto-instrumentations-node");
import inc = require("@opentelemetry/instrumentation-nestjs-core");
import oik = require("opentelemetry-instrumentation-kafkajs");

new otel.OpenTelemetryBuilder('battery-api')
  .withTracing(options =>
    options
      .withSampler(new stb.AlwaysOnSampler())
      .withSpanExporter(new etoh.OTLPTraceExporter())
      .withSpanProcessor(exporter => new stb.BatchSpanProcessor(exporter))
      .withInstrumentation(
        ain.getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': {
            enabled: false
          },
        }),
        new inc.NestInstrumentation({
          enabled: true
        }),
        new oik.KafkaJsInstrumentation({
          enabled: true
        })
      )
  )
  .start();

import 'dotenv/config';

import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {AppModule} from './app/app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {BatteryMeasurementsConsumerService} from "./app/services/battery-measurements-consumer.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3002;
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Battery API')
    .setDescription('The API specification for the battery controller.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.get(BatteryMeasurementsConsumerService).run();

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
