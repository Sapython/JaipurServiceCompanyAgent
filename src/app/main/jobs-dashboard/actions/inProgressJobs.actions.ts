import { createAction, props } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';

export const LOAD_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page In-Progress Jobs Loading',
);

export const SUCCESS_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page In-Progress Jobs Success',
  props<{ jobs: Booking[] }>(),
);

export const ERROR_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page In-Progress Jobs Error',
  props<{ error: any }>(),
);
