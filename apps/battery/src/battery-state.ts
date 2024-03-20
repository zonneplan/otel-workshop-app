import {BatteryOperatingState} from '@otel-workshop-app/shared';

export interface BatteryState {
  /**
   * the actual percentage of the battery,
   * between 0 and 100
   */
  percentage: number;

  /**
   * The current operating state of the battery
   */
  operatingState: BatteryOperatingState;
}
