import otel = require('@zonneplan/open-telemetry-node');
import zonneplan = require('@zonneplan/open-telemetry-zonneplan');
import stb = require('@opentelemetry/sdk-trace-base');
import ki = require('opentelemetry-instrumentation-kafkajs');
import etoh = require('@opentelemetry/exporter-trace-otlp-http');
import ni = require('@opentelemetry/instrumentation-nestjs-core');
import noi = require('@opentelemetry/auto-instrumentations-node');

new otel.OpenTelemetryBuilder('battery-api')
  .withLogging(zonneplan.DefaultLoggingOptions)
  .withTracing((options) =>
    options
      .withSampler(new stb.AlwaysOnSampler())
      .withSpanExporter(new etoh.OTLPTraceExporter())
      .withSpanProcessor((exporter) => new stb.BatchSpanProcessor(exporter))
      .withInstrumentation(
        ...noi.getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': {
            enabled: false,
          },
        }),
        new ki.KafkaJsInstrumentation({
          enabled: true,
        }),
        new ni.NestInstrumentation({
          enabled: true,
        })
      )
  )
  .start();

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BatteryMeasurementsConsumerService } from './app/services/battery-measurements-consumer.service';
import { LoggerFactory } from '@zonneplan/open-telemetry-zonneplan';

async function bootstrap() {
  const logger = new LoggerFactory().create('main');

  const app = await NestFactory.create(AppModule, { logger });
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
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
