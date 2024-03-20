import {ApiProperty} from "@nestjs/swagger";

export class BatteryInstructionResponseDto {
  @ApiProperty({
    type: Number,
    description: 'The unique identifier of the instruction that was sent to the battery'
  })
  public readonly id: number;

  public constructor(
    id: number
  ) {
    this.id = id;
  }
}
