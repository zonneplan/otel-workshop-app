import {Module} from '@nestjs/common';
import {Kafka} from "kafkajs";
import {kafkaInstance} from "./kafka";

@Module({
  controllers: [],
  providers: [
    {
      provide: Kafka,
      useValue: kafkaInstance
    }
  ],
  exports: [Kafka],
})
export class KafkaModule {
}
