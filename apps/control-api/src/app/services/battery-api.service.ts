import {Injectable} from "@nestjs/common";
import {BatteryState} from "@otel-workshop-app/shared";

@Injectable()
export class BatteryApiService {
  private readonly _apiUrl = process.env['BATTERY_API_URL'];

  public getInfo(): Promise<BatteryState | null> {
    return this.getResponse('info');
  }

  public charge(): Promise<{ id: number }> {
    return this.getResponse('charge', 'POST');
  }

  public discharge(): Promise<{ id: number }> {
    return this.getResponse('discharge', 'POST');
  }

  private async getResponse<T>(endpoint: string, method: RequestInit['method'] = 'GET'): Promise<T> {
    const response = await fetch(`${this._apiUrl}/battery/${endpoint}`, {
      method,
    })
    if (!response.ok) {
      return null;
    }

    return response.json();
  }
}
