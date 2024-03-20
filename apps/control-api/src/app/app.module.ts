import {Module} from '@nestjs/common';
import {Client} from "pg";
import {BatteryInstructionStatusConsumerService} from "./services/battery-instruction-status-consumer.service";
import {InstructionRepository} from "./repositories/instruction.repository";
import {BatteryApiService} from "./services/battery-api.service";
import {KafkaConsumerModule} from "@otel-workshop-app/kafka";
import {BatteryController} from "./controllers/battery.controller";

@Module({
  imports: [KafkaConsumerModule],
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
      }
    }],
})
export class AppModule {
}
