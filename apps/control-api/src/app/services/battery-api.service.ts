import { Injectable } from '@nestjs/common';
import { BatteryState } from '@otel-workshop-app/shared';
import { LoggerService } from '@zonneplan/open-telemetry-nest';

@Injectable()
export class BatteryApiService {
  private readonly _apiUrl = process.env['BATTERY_API_URL'];

  public constructor(private readonly loggerService: LoggerService) {
    loggerService.setContext(this.constructor.name);
  }

  public getInfo(): Promise<BatteryState | null> {
    return this.getResponse('info');
  }

  public charge(): Promise<{ id: number }> {
    return this.getResponse('charge', 'POST');
  }

  public discharge(): Promise<{ id: number }> {
    return this.getResponse('discharge', 'POST');
  }

  private async getResponse<T>(
    endpoint: string,
    method: RequestInit['method'] = 'GET'
  ): Promise<T> {
    const response = await fetch(`${this._apiUrl}/battery/${endpoint}`, {
      method,
    });

    if (!response.ok) {
      this.loggerService.log(`Failed to fetch ${endpoint} from battery API`, {
        status: response.status,
        statusText: response.statusText,
      });

      return null;
    }

    return response.json();
  }
}
