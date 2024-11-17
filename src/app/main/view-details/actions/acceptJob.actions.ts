import { createAction, props } from '@ngrx/store';

export const ACCEPT = createAction('[ViewDetails] Accept Job');

export const FAILED = createAction(
  '[ViewDetails] Accept Job Failed',
  props<{ error: any }>(),
);

export const SUCCESSFUL = createAction('[ViewDetails] Accept Job');
