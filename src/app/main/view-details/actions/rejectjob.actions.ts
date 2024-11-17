import { createAction, props } from '@ngrx/store';

export const REJECT = createAction(
  '[ViewDetails] Reject Job',
  props<{ agentId: string }>(),
);

export const FAILED = createAction(
  '[ViewDetails] Reject Job Failed',
  props<{ error: any }>(),
);

export const REJECTED = createAction('[ViewDetails] Reject Job');
