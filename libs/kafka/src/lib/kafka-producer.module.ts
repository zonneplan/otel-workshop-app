import {Module} from '@nestjs/common';
import {KafkaModule} from "./kafka.module";
import {KafkaProducer} from "./kafka.producer";

@Module({
  imports: [KafkaModule],
  providers: [KafkaProducer],
  exports: [KafkaProducer],
})
export class KafkaProducerModule {
}
