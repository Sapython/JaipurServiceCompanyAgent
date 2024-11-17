import { createAction, props } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';

export const changeMonth = createAction(
  '[Money Page] Month Changed',
  props<{ date: Date }>(),
);
export const changeMonthFailure = createAction(
  '[Money Page] Month Changed Failed',
  props<{ error: string }>(),
);
export const changeMonthSuccess = createAction(
  '[Money Page] Month Changed Success',
  props<{
    bookings: Booking[];
    totalEarning: number;
    totalDeduction: number;
    netEarning: number;
  }>(),
);
