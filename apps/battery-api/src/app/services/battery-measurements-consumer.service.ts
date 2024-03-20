import {Injectable} from "@nestjs/common";
import {KafkaConsumer} from "@otel-workshop-app/kafka";
import {BatteryState} from "@otel-workshop-app/shared";
import {BatteryMeasurementCacheRepository} from "../repositories/battery-measurement-cache.repository";
import {setAttributesOnActiveSpan, span} from "@zonneplan/open-telemetry-node";

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

  @span()
  private handleMessage(measurement: BatteryState) {
    setAttributesOnActiveSpan({
      'data.percentage': measurement.percentage,
      'data.operatingState': measurement.operatingState
    });

    this.batteryMeasurementCacheRepository.setLatestState(measurement);
  }
}
