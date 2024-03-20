import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { BatteryStateResponseDto } from '../models/battery-state-response.dto';
import { InstructionStatusDto } from '../models/instruction-status.dto';
import { InstructionRepository } from '../repositories/instruction.repository';
import { BatteryApiService } from '../services/battery-api.service';
import { BatteryInstructionResponseDto } from '../models/battery-instruction-response.dto';
import { Counter } from '@zonneplan/open-telemetry-node';
import { InjectMetric } from '@zonneplan/open-telemetry-nest';

@Controller('battery')
export class BatteryController {
  public constructor(
    private readonly instructionRepository: InstructionRepository,
    private readonly batteryApiService: BatteryApiService,
    @InjectMetric('battery_instruction_calls')
    private readonly batteryInstructionCalls: Counter
  ) {}

  @Get('info')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: BatteryStateResponseDto,
  })
  public async getInfo(): Promise<BatteryStateResponseDto> {
    const response = await this.batteryApiService.getInfo();
    if (!response) {
      throw new NotFoundException('No battery info found');
    }

    return new BatteryStateResponseDto(response);
  }

  @Get('instruction-status/:instructionId')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: InstructionStatusDto,
  })
  public async getStatus(
    @Param('instructionId') instructionId: number
  ): Promise<InstructionStatusDto> {
    const status = await this.instructionRepository.getInstructionStatus(
      instructionId
    );
    if (!status) {
      throw new NotFoundException('No instruction status found');
    }

    return new InstructionStatusDto(status);
  }

  @Post('charge')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: BatteryInstructionResponseDto,
  })
  public async charge(): Promise<BatteryInstructionResponseDto> {
    // Je zou op deze plek in in de discharge dus ook het volgende kunnen doen:
    // const counter = getOrCreateMetric({
    //   type: 'Counter',
    //   valueType: ValueType.INT,
    //   description: 'Number of times an instruction has been passed to the battery',
    //   name: 'battery_instruction_calls',
    // })
    //
    // counter.add(1);
    // Maar hierdoor wordt bijvoorbeeld het testen van je code al een stuk lastiger.

    this.batteryInstructionCalls.add(1, {
      instruction: 'charge',
    });
    const { id } = await this.batteryApiService.charge();

    return new BatteryInstructionResponseDto(id);
  }

  @Post('discharge')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: BatteryInstructionResponseDto,
  })
  public async discharge(): Promise<BatteryInstructionResponseDto> {
    this.batteryInstructionCalls.add(1, {
      instruction: 'discharge',
    });
    const { id } = await this.batteryApiService.discharge();

    return new BatteryInstructionResponseDto(id);
  }
}
