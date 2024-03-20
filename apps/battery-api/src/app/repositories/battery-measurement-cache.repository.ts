import {Injectable} from "@nestjs/common";
import {BatteryState} from "@otel-workshop-app/shared";
import {span} from "@zonneplan/open-telemetry-node";

@Injectable()
export class BatteryMeasurementCacheRepository {
  private latestState: BatteryState | undefined;

  @span()
  public setLatestState(state: BatteryState) {
    this.latestState = state;
  }

  @span()
  public getLatestState(): BatteryState | undefined {
    return this.latestState;
  }
}
