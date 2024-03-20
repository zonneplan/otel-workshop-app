import {Injectable} from "@nestjs/common";
import {KafkaConsumer} from "@otel-workshop-app/kafka";
import {BatteryState} from "@otel-workshop-app/shared";
import {BatteryMeasurementCacheRepository} from "../repositories/battery-measurement-cache.repository";

@Injectable()
export class BatteryMeasurementsConsumerService {
  public constructor(
    private readonly kafkaConsumer: KafkaConsumer,
    private readonly batteryMeasurementCacheRepository: BatteryMeasurementCacheRepository,
  ) {
  }

  public async run() {
    await this.kafkaConsumer.subscribe([
      process.env['KAFKA_TOPIC_BATTERY_MEASUREMENTS']
    ])

    await this.kafkaConsumer.consume(async ({message}) => {
      const parsedMessage = JSON.parse(message.value?.toString() ?? '{}');

      this.handleMessage(parsedMessage);
    })
  }

  private handleMessage(measurement: BatteryState) {
    this.batteryMeasurementCacheRepository.setLatestState(measurement);
  }
}
