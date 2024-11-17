import { createAction, props } from '@ngrx/store';
import { AcceptancePendingJob } from '../model/home.structure';

export const ACCEPT = createAction(
  '[Home Page] Accept Job',
  props<{ job: AcceptancePendingJob }>(),
);

export const SUCCESSFUL = createAction(
  '[Home Page] Job Accepted Successfully',
  props<{ job: AcceptancePendingJob }>(),
);

export const FAILED = createAction(
  '[Home Page] Job Acceptance Failed',
  props<{ error: any }>(),
);
