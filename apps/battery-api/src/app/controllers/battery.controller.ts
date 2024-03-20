import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { BatteryMeasurementCacheRepository } from '../repositories/battery-measurement-cache.repository';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { BatteryStateResponseDto } from '../models/battery-state-response.dto';
import { BatteryInstructionService } from '../services/battery-instruction.service';
import { BatteryInstructionResponseDto } from '../models/battery-instruction-response.dto';

@Controller('battery')
export class BatteryController {
  public constructor(
    private readonly batteryMeasurementsCacheRepository: BatteryMeasurementCacheRepository,
    private readonly batteryInstructionService: BatteryInstructionService
  ) {}

  @Get('info')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse()
  @ApiOkResponse({
    type: BatteryStateResponseDto,
  })
  public async getInfo(): Promise<BatteryStateResponseDto> {
    const state = this.batteryMeasurementsCacheRepository.getLatestState();
    if (!state) {
      throw new NotFoundException('No battery state found');
    }

    return new BatteryStateResponseDto(state);
  }

  @Post('charge')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: BatteryInstructionResponseDto,
  })
  public async charge(): Promise<BatteryInstructionResponseDto> {
    const id = await this.batteryInstructionService.sendState('charging');

    return new BatteryInstructionResponseDto(id);
  }

  @Post('discharge')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: BatteryInstructionResponseDto,
  })
  public async discharge(): Promise<BatteryInstructionResponseDto> {
    const id = await this.batteryInstructionService.sendState('discharging');

    return new BatteryInstructionResponseDto(id);
  }
}
