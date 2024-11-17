import { createAction, props } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';

export const LOAD_ACTION = createAction(
  '[Home Page] Home Page Accepted Jobs Loading',
);

export const SUCCESS_ACTION = createAction(
  '[Home Page] Home Page Accepted Jobs Success',
  props<{ jobs: Booking[] }>(),
);

export const ERROR_ACTION = createAction(
  '[Home Page] Home Page Accepted Jobs Error',
  props<{ error: any }>(),
);
