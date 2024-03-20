import { Module } from '@nestjs/common';
import {
  KafkaConsumerModule,
  KafkaProducerModule,
} from '@otel-workshop-app/kafka';
import { BatteryController } from './controllers/battery.controller';
import { BatteryMeasurementsConsumerService } from './services/battery-measurements-consumer.service';
import { BatteryMeasurementCacheRepository } from './repositories/battery-measurement-cache.repository';
import { BatteryInstructionService } from './services/battery-instruction.service';
import { LoggerModule } from '@zonneplan/open-telemetry-zonneplan';

@Module({
  imports: [KafkaConsumerModule, KafkaProducerModule, LoggerModule],
  controllers: [BatteryController],
  providers: [
    // Services
    BatteryMeasurementsConsumerService,
    BatteryInstructionService,

    // Repositories
    BatteryMeasurementCacheRepository,
  ],
})
export class AppModule {}
