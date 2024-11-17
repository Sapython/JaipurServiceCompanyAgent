import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { createAction, props } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';

export const LOAD_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Pending Jobs Loading',
);

export const SUCCESS_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Pending Jobs Success',
  props<{ jobs: Booking[] }>(),
);

export const ERROR_ACTION = createAction(
  '[Jobs-DashBoard] Jobs-DashBoard Page Pending Jobs Error',
  props<{ error: any }>(),
);
