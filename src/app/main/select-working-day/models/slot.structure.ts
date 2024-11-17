import { Timestamp } from 'firebase/firestore';
import { TimeSlot } from './select-working-day.structure';

export interface Slot {
  id: string;
  day: Timestamp;
  working: boolean;
  bookings: string[];
}
