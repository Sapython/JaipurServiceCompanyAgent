import { createAction, props } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';

export const loadBooking = createAction(
  '[ViewDetails] Load Booking from cache',
  props<{ id: string; customerId: string }>(),
);

export const cacheLoaded = createAction(
  '[ViewDetails] Cache Loaded',
  props<{ booking: Booking }>(),
);

export const loadUpdatedBooking = createAction(
  '[ViewDetails] Load Updated Booking from backend',
  props<{ id: string; customerId: string }>(),
);

export const loadBookingSuccess = createAction(
  '[ViewDetails] Load Booking Success',
  props<{ booking: Booking }>(),
);

export const loadBookingFailure = createAction(
  '[ViewDetails] Load Booking Failure',
  props<{ error: any }>(),
);
