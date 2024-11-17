import { createAction, props } from '@ngrx/store';
import { State } from '../models/address.structure';

export const LOAD = createAction('[Signup] Load States');

export const SUCCESS = createAction(
  '[Signup] Load States Success',
  props<{ states: State[] }>(),
);

export const FAILED = createAction(
  '[Signup] Load States Failed',
  props<{ error: string }>(),
);
