import {BatteryOperatingState, BatteryState} from "@otel-workshop-app/shared";
import {ApiProperty} from "@nestjs/swagger";

export class BatteryStateResponseDto {
  @ApiProperty({
    type: Number,
    description: 'The current battery percentage, between 0 and 100'
  })
  public readonly percentage: number;

  @ApiProperty({
    type: String,
    enum: ['idle', 'charging', 'discharging'],
    description: 'The current operating state of the battery'
  })
  public readonly operatingState: BatteryOperatingState;

  public constructor(
    data: BatteryState
  ) {
    this.percentage = data.percentage;
    this.operatingState = data.operatingState;
  }
}
