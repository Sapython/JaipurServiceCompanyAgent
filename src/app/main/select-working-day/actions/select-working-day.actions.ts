import { createAction, props } from '@ngrx/store';
import { Slot } from '../models/slot.structure';
import { Timestamp } from '@angular/fire/firestore';
import { TimeSlot } from '../models/select-working-day.structure';

export const loadInitialData = createAction(
  '[Select Working Day] Load Initial Data',
);

export const initialDataLoaded = createAction(
  '[Select Working Day] Initial Data Loaded',
  props<{
    slots: Slot[];
    working: boolean | Timestamp;
    timeSlots: TimeSlot[];
    jobPerDay: number;
  }>(),
);

export const loadAllTimeSlots = createAction('[Select Working Day] Load Slots');
export const allTimeSlotsLoaded = createAction(
  '[Select Working Day] All Slots Loaded',
  props<{ slots: TimeSlot[] }>(),
);
export const loadAllTimeSlotsFailed = createAction(
  '[Select Working Day] Load Slots Failed',
  props<{ error: any }>(),
);

export const setAsWorking = createAction('[Select Working Day] Set As Working');

export const setAsNonWorking = createAction(
  '[Select Working Day] Set As Not Working',
  props<{ day: boolean | Timestamp }>(),
);

export const selectDate = createAction(
  '[Select Working Day] Select Date',
  props<{ index: number }>(),
);

export const setJobPerday = createAction(
  '[Select Working Day] Set Job Per Day',
  props<{ jobPerDay: number }>(),
);

export const enableWorkingHour = createAction(
  '[Select Working Day] Enable Working Hour',
  props<{ id: string }>(),
);

export const disableWorkingHour = createAction(
  '[Select Working Day] Disable Working Hour',
  props<{ id: string }>(),
);

export const saveSlotDetails = createAction(
  '[Select Working Day] Save Slot Details',
);

export const slotDetailsSaved = createAction(
  '[Select Working Day] Slot Details Saved',
);

export const saveSlotDetailsFailed = createAction(
  '[Select Working Day] Save Slot Details Failed',
  props<{ error: any }>(),
);


export const enableTimeSlot = createAction(
  '[Select Working Day] Enable Time Slot',
  props<{ id: string }>(),
);

export const disableTimeSlot = createAction(
  '[Select Working Day] Disable Time Slot',
  props<{ id: string }>(),
);
