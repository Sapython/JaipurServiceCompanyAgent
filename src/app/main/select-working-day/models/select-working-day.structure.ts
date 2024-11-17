import { Timestamp } from '@angular/fire/firestore';
import { Slot } from './slot.structure';

export interface SelectWorkingDayPageState {
  agentWorking: boolean | Timestamp;
  weekSlots: Slot[];
  selectedSlotIndex: number;
  timeSlots: TimeSlot[];
  jobPerDay: number;
}
export interface TimeSlot {
  id: string;
  active: boolean;
  duration: number;
  end: string;
  index: string;
  name: string;
  start: string;
  enabled: boolean;
}
