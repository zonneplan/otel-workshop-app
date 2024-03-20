import EventEmitter from "node:events";
import {BatteryState} from "./battery-state";
import {KafkaProducer} from "@otel-workshop-app/kafka";
import {BatteryInstruction, BatteryInstructionResponse, BatteryOperatingState} from "@otel-workshop-app/shared";

export class Battery extends EventEmitter {
  private state: BatteryState = {
    percentage: 50,
    operatingState: 'idle',
  }

  private tickCounter = 0;

  public constructor(
    private readonly kafkaProducer: KafkaProducer,
  ) {
    super();

    setInterval(() => this.tick(), 1000);
    setInterval(() => this.publishMeasurements(), 5000);
  }

  public handleInstruction({state: incomingState, id}: BatteryInstruction) {
    if (incomingState === 'charging' && this.state.percentage === 100 || incomingState === 'discharging' && this.state.percentage === 0) {
      this.publishInstructionStatus({
        id,
        status: 'error'
      }).then()
    }

    if (incomingState !== this.state.operatingState) {
      this.publishInstructionStatus({
        id,
        status: 'success'
      }).then();
    }

    this.setOperatingState(incomingState);
  }

  private tick() {
    this.tickCounter++;
    if (this.tickCounter % 5 === 0) {
      this.publishMeasurements().then();
    }

    const {operatingState, percentage} = this.state;

    if (operatingState === 'idle') {
      return;
    }

    const increment = Math.random() * 0.9 + 0.1; // increment between 0.1 and 1.0
    const newPercentage = operatingState === 'charging'
      ? Math.min(percentage + increment, 100)
      : Math.max(percentage - increment, 0);

    const shouldBeIdle = operatingState === 'charging' && newPercentage === 100 || operatingState === 'discharging' && newPercentage === 0;
    const newOperatingState = shouldBeIdle ? 'idle' : operatingState;

    this.state = {
      ...this.state,
      percentage: newPercentage,
    };

    this.setOperatingState(newOperatingState);
    this.emit('tick', newPercentage);
  }

  private publishMeasurements(): Promise<void> {
    return this.kafkaProducer.send(process.env['KAFKA_TOPIC_BATTERY_MEASUREMENTS'], this.state);
  }

  private publishInstructionStatus(instructionResponse: BatteryInstructionResponse): Promise<void> {
    return this.kafkaProducer.send(process.env['KAFKA_TOPIC_BATTERY_INSTRUCTION_STATUS'], instructionResponse);
  }

  private setOperatingState(newState: BatteryOperatingState): void {
    const stateIsDifferent = newState !== this.state.operatingState;

    if (stateIsDifferent) {
      this.emit('operating-state', newState);
    }

    this.state = {
      ...this.state,
      operatingState: newState
    };
  }
}
