import { createAction, props } from '@ngrx/store';

export const VERIFY = createAction(
  '[ViewDetails] Reject Job',
  props<{ agentId: string }>(),
);

export const FAILED = createAction(
  '[ViewDetails] Reject Job Failed',
  props<{ error: any }>(),
);

export const ACCEPTED = createAction('[ViewDetails] Reject Job');
