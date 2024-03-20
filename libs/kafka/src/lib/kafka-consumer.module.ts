import {Module} from '@nestjs/common';
import {KafkaConsumer} from "./kafka.consumer";
import {KafkaModule} from "./kafka.module";

@Module({
  imports: [KafkaModule],
  providers: [KafkaConsumer],
  exports: [KafkaConsumer],
})
export class KafkaConsumerModule {
}
