import { createAction, props } from '@ngrx/store';

export const COMPLETE = createAction('[ViewDetails] Complete Job');

export const FAILED = createAction(
  '[ViewDetails] Complete Job Failed',
  props<{ error: any }>(),
);

export const SUCCESSFUL = createAction('[ViewDetails] Complete Job Successful');
