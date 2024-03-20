import { Module } from '@nestjs/common';
import { Client } from 'pg';
import { BatteryInstructionStatusConsumerService } from './services/battery-instruction-status-consumer.service';
import { InstructionRepository } from './repositories/instruction.repository';
import { BatteryApiService } from './services/battery-api.service';
import { KafkaConsumerModule } from '@otel-workshop-app/kafka';
import { BatteryController } from './controllers/battery.controller';
import { LoggerModule } from '@zonneplan/open-telemetry-zonneplan';
import { ValueType } from '@opentelemetry/api';
import { createCounterProvider } from '@zonneplan/open-telemetry-nest';

@Module({
  imports: [KafkaConsumerModule, LoggerModule],
  controllers: [BatteryController],
  providers: [
    // Services
    BatteryInstructionStatusConsumerService,
    BatteryApiService,

    // Repositories
    InstructionRepository,

    // Database clients
    {
      provide: Client,
      useFactory: async () => {
        const client = new Client({
          connectionString: process.env['CONTROL_DATABASE_URL'],
        });

        await client.connect();
        return client;
      },
    },
    createCounterProvider({
      valueType: ValueType.INT,
      description:
        'Number of times an instruction has been passed to the battery',
      name: 'battery_instruction_calls',
    }),
  ],
})
export class AppModule {}
