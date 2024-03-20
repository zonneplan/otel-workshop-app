import {Consumer, EachMessageHandler, Kafka} from "kafkajs";
import {OnModuleDestroy, OnModuleInit} from "@nestjs/common";

export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly consumer: Consumer;

  public constructor(
    kafkaClient: Kafka
  ) {
    const groupId = process.env["KAFKA_GROUP_ID"];
    if (!groupId) {
      throw new Error("Group ID must be defined");
    }

    this.consumer = kafkaClient.consumer({
      groupId
    });
  }

  public consume(callback: EachMessageHandler): Promise<void> {
    return this.consumer.run({
      eachMessage: callback
    });
  }

  public subscribe(topics: string[]): Promise<void> {
    return this.consumer.subscribe({
      topics
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.consumer.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }
}
