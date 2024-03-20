import {Injectable} from "@nestjs/common";
import {KafkaConsumer} from "@otel-workshop-app/kafka";
import {BatteryInstructionResponse} from "@otel-workshop-app/shared";
import {InstructionRepository} from "../repositories/instruction.repository";

@Injectable()
export class BatteryInstructionStatusConsumerService {
  public constructor(
    private readonly kafkaConsumer: KafkaConsumer,
    private readonly instructionsRepository: InstructionRepository
  ) {
  }

  public async run() {
    await this.kafkaConsumer.subscribe([
      process.env['KAFKA_TOPIC_BATTERY_INSTRUCTION_STATUS']
    ])

    await this.kafkaConsumer.consume(async ({message}) => {
      const parsedMessage = JSON.parse(message.value?.toString() ?? '{}');

      await this.handleMessage(parsedMessage);
    })
  }

  private handleMessage(measurement: BatteryInstructionResponse) {
    return this.instructionsRepository.setInstructionStatus(measurement.id, measurement.status);
  }
}
