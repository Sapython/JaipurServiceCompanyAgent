import { createAction, props } from '@ngrx/store';
import { DateRange } from '../reducer/jobs-dashboard.reducer';
import { Booking } from 'src/app/shared/models/booking.structure';

export const LOAD_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Cancelled Jobs Loading',
  props<{ dateRange: DateRange }>(),
);

export const SUCCESS_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Cancelled Jobs Success',
  props<{ jobs: Booking[] }>(),
);

export const ERROR_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Cancelled Jobs Error',
  props<{ error: any }>(),
);
