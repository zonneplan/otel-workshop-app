import 'dotenv/config';
import {Battery} from "./battery";
import {KafkaConsumer, kafkaInstance, KafkaProducer} from "@otel-workshop-app/kafka";
import {BatteryInstruction} from "@otel-workshop-app/shared";

const kafkaConsumer = new KafkaConsumer(kafkaInstance);
const kafkaProducer = new KafkaProducer(kafkaInstance);

kafkaConsumer.onModuleInit().then();
kafkaProducer.onModuleInit().then();

kafkaConsumer.subscribe([
  process.env['KAFKA_TOPIC_BATTERY_INSTRUCTIONS'],
]).then()

const battery = new Battery(
  kafkaProducer
);

battery.on('operating-state', (operatingState) => {
  console.log(`Battery state changed to: ${operatingState}`);
});

battery.on('tick', (percentage) => {
  console.log(`Battery percentage set to: ${percentage}`);
});

kafkaConsumer.consume(async ({message}) => {
  const parsedMessage = JSON.parse(message.value?.toString() ?? '{}') as BatteryInstruction;

  battery.handleInstruction(parsedMessage);
}).then()
