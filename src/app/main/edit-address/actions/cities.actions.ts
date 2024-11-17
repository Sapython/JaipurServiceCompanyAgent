import { createAction, props } from '@ngrx/store';
import { City } from 'src/app/auth/signup/models/address.structure';

export const LOAD = createAction(
  '[Edit Address] Load Cities',
  props<{ stateId: string }>(),
);

export const SUCCESS = createAction(
  '[Edit Address] Load Cities Success',
  props<{ cities: City[] }>(),
);

export const FAILED = createAction(
  '[Edit Address] Load Cities Failed',
  props<{ error: string }>(),
);
