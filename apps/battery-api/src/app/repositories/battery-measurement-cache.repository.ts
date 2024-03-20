import {Injectable} from "@nestjs/common";
import {BatteryState} from "@otel-workshop-app/shared";

@Injectable()
export class BatteryMeasurementCacheRepository {
  private latestState: BatteryState | undefined;

  public setLatestState(state: BatteryState) {
    this.latestState = state;
  }

  public getLatestState(): BatteryState | undefined {
    return this.latestState;
  }
}
