import { createReducer, on } from '@ngrx/store';
import { SelectWorkingDayPageState } from '../models/select-working-day.structure';
import {
  disableTimeSlot,
  disableWorkingHour,
  enableTimeSlot,
  enableWorkingHour,
  initialDataLoaded,
  selectDate,
  setAsNonWorking,
  setAsWorking,
  setJobPerday,
} from '../actions/select-working-day.actions';
import { Timestamp } from '@angular/fire/firestore';

export const initialState: SelectWorkingDayPageState = {
  agentWorking: false,
  selectedSlotIndex: -1,
  weekSlots: [],
  timeSlots: [],
  jobPerDay: 0,
};

export const selectWorkingDayReducer = createReducer(
  initialState,
  on(initialDataLoaded, (state, { slots, working, timeSlots, jobPerDay }) => ({
    ...state,
    weekSlots: slots,
    agentWorking: working,
    timeSlots,
    selectedSlotIndex: 0,
    jobPerDay
  })),
  on(selectDate, (state, { index }) => ({
    ...state,
    selectedSlotIndex: index,
  })),
  on(setJobPerday, (state, { jobPerDay }) => ({
    ...state,
    jobPerDay
  })),
  on(setAsWorking, (state) => ({
    ...state,
    agentWorking: true,
    weekSlots: state.weekSlots.map((slot, index) => {
      return {
        ...slot,
        working: true,
      };
    }),
  })),
  on(setAsNonWorking, (state, { day }) => ({
    // if day is instance of Timestamp, then disable the working of that date
    // if day is boolean and is false then disable all working days
    ...state,
    agentWorking: day instanceof Timestamp ? false : day,
    weekSlots: state.weekSlots.map((slot, index) => {
      if (day instanceof Timestamp) {
        if (slot.day.toDate().getDay() == day.toDate().getDay()) {
          return {
            ...slot,
            working: false,
          };
        } else {
          return slot;
        }
      } else {
        return {
          ...slot,
          working: false,
        };
      }
    }),
  })),
  on(enableWorkingHour, (state, { id }) => ({
    ...state,
    weekSlots: state.weekSlots.map((slot, index) => {
      if (slot.id == id) {
        return {
          ...slot,
          working: true,
        };
      } else {
        return slot;
      }
    }),
  })),
  on(disableWorkingHour, (state, { id }) => ({
    ...state,
    weekSlots: state.weekSlots.map((slot, index) => {
      if (slot.id == id) {
        return {
          ...slot,
          working: false,
        };
      } else {
        return slot;
      }
    }),
  })),
  on(disableTimeSlot, (state, { id }) => ({
    ...state,
    timeSlots: state.timeSlots.map((slot, index) => {
      if (slot.id == id) {
        return {
          ...slot,
          enabled: false,
        };
      } else {
        return slot;
      }
    }),
  })),
  on(enableTimeSlot, (state, { id }) => ({
    ...state,
    timeSlots: state.timeSlots.map((slot, index) => {
      if (slot.id == id) {
        return {
          ...slot,
          enabled: true,
        };
      } else {
        return slot;
      }
    }),
  }))
);
