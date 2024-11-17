import { createAction, props } from '@ngrx/store';
import { AcceptancePendingJob } from '../model/home.structure';

export const REJECT = createAction(
  '[Home Page] Reject Job',
  props<{ job: AcceptancePendingJob }>(),
);

export const SUCCESSFUL = createAction(
  '[Home Page] Job Rejected Successfully',
  props<{ job: AcceptancePendingJob }>(),
);

export const FAILED = createAction(
  '[Home Page] Job Rejection Failed',
  props<{ error: any }>(),
);
