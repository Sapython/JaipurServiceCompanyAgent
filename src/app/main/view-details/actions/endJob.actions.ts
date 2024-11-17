import { createAction, props } from '@ngrx/store';

export const END_JOB = createAction(
  '[ViewDetails] End Job',
  props<{ agentId: string }>(),
);

export const FAILED = createAction(
  '[ViewDetails] End Job Failed',
  props<{ error: any }>(),
);

export const SUCCESSFUL = createAction('[ViewDetails] End Job Successful');
