import {BatteryOperatingState} from "./battery-operating-state.model";

export interface BatteryInstruction {
  id: number;
  state: BatteryOperatingState;
}

export interface BatteryInstructionResponse {
  id: number;
  status: 'success' | 'error';
}
