import { Injectable } from '@nestjs/common';
import { BatteryState } from '@otel-workshop-app/shared';
import { LoggerService } from '@zonneplan/open-telemetry-nest';
import { span } from '@zonneplan/open-telemetry-node';
import axios from 'axios';

@Injectable()
export class BatteryApiService {
  private readonly _apiUrl = process.env['BATTERY_API_URL'];
  private readonly _client = axios.create({
    timeout: 5000,
    validateStatus: (status) => status >= 200 && status < 500,
  });

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
    const fn = method === 'GET' ? this._client.get : this._client.post;

    const response = await fn(`${this._apiUrl}/battery/${endpoint}`);

    if (response.status < 200 || response.status >= 300) {
      this.loggerService.log(`Failed to fetch ${endpoint} from battery API`, {
        status: response.status,
        statusText: response.statusText,
      });

      return null;
    }

    return response.data;
  }
}
