import { createAction, props } from '@ngrx/store';
import { Area } from '../models/address.structure';

export const LOAD = createAction(
  '[Signup] Load Areas',
  props<{ stateId: string; cityId: string }>(),
);

export const SUCCESS = createAction(
  '[Signup] Load Areas Success',
  props<{ areas: Area[] }>(),
);

export const FAILED = createAction(
  '[Signup] Load Areas Failed',
  props<{ error: string }>(),
);
