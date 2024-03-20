import { Injectable } from '@nestjs/common';
import { KafkaProducer } from '@otel-workshop-app/kafka';
import {
  BatteryInstruction,
  BatteryOperatingState,
} from '@otel-workshop-app/shared';
import { span } from '@zonneplan/open-telemetry-node';
import { LoggerService } from '@zonneplan/open-telemetry-nest';

@Injectable()
export class BatteryInstructionService {
  public constructor(
    private readonly kafkaProducer: KafkaProducer,
    private readonly logger: LoggerService
  ) {
    logger.setContext(this.constructor.name);
  }

  @span()
  public async sendState(state: BatteryOperatingState): Promise<number> {
    const id = this.getRandomIdentifier();
    const instruction: BatteryInstruction = {
      id,
      state,
    };

    await this.kafkaProducer.send(
      process.env['KAFKA_TOPIC_BATTERY_INSTRUCTIONS'],
      instruction
    );

    this.logger.log(
      `Sent battery instruction with id ${id} and state ${state}`
    );

    return id;
  }

  private getRandomIdentifier() {
    // Normally we would like a safer approach to generate an identifier
    // But it suffices for this example :)
    return Math.floor(Math.random() * 1000000) + 1;
  }
}
