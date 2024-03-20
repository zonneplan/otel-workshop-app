import {Injectable} from "@nestjs/common";
import {KafkaProducer} from "@otel-workshop-app/kafka";
import {BatteryInstruction, BatteryOperatingState} from "@otel-workshop-app/shared";

@Injectable()
export class BatteryInstructionService {
  public constructor(
    private readonly kafkaProducer: KafkaProducer
  ) {
  }

  public async sendState(state: BatteryOperatingState): Promise<number> {
    const id = this.getRandomIdentifier();
    const instruction: BatteryInstruction = {
      id,
      state
    }

    await this.kafkaProducer.send(process.env['KAFKA_TOPIC_BATTERY_INSTRUCTIONS'], instruction);

    return id;
  }

  private getRandomIdentifier() {
    // Normally we would like a safer approach to generate an identifier
    // But it suffices for this example :)
    return Math.floor(Math.random() * 1000000) + 1;
  }
}
