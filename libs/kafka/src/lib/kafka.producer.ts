import {Kafka, Partitioners, Producer} from "kafkajs";
import {OnModuleDestroy, OnModuleInit} from "@nestjs/common";

export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private readonly producer: Producer;

  public constructor(
    kafkaClient: Kafka
  ) {
    this.producer = kafkaClient.producer({
      createPartitioner: Partitioners.DefaultPartitioner
    });
  }

  public async send<T>(topic: string, data: T): Promise<void> {
    await this.producer.send({
      topic,
      acks: 1,
      messages: [{
        value: JSON.stringify(data)
      }]
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.producer.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }
}
