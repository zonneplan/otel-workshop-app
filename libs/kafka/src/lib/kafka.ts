import {Kafka} from "kafkajs";

export const kafkaInstance = new Kafka({
  brokers: process.env['KAFKA_BROKERS']?.split(',') ?? [],
  clientId: process.env['KAFKA_CLIENT_ID'],
  retry: {
    retries: 10,
  }
})
