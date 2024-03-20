import {ApiProperty} from "@nestjs/swagger";

export class InstructionStatusDto {
  @ApiProperty({
    type: String,
    description: 'The status of the instruction'
  })
  public readonly status: string;

  public constructor(
    status: string
  ) {
    this.status = status;
  }
}
