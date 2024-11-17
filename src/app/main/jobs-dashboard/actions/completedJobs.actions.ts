import { createAction, props } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';
import { DateRange } from '../reducer/jobs-dashboard.reducer';

export const LOAD_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Completed Jobs Loading',
  props<{ dateRange: DateRange }>(),
);

export const SUCCESS_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Completed Jobs Success',
  props<{ jobs: Booking[] }>(),
);

export const ERROR_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Completed Jobs Error',
  props<{ error: any }>(),
);
