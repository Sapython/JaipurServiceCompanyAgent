import { createAction, props } from '@ngrx/store';
import { City } from '../models/address.structure';

export const LOAD = createAction(
  '[Signup] Load Cities',
  props<{ stateId: string }>(),
);

export const SUCCESS = createAction(
  '[Signup] Load Cities Success',
  props<{ cities: City[] }>(),
);

export const FAILED = createAction(
  '[Signup] Load Cities Failed',
  props<{ error: string }>(),
);
