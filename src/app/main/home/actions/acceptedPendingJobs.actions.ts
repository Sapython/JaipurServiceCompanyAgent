import { createAction, props } from '@ngrx/store';
import { AcceptancePendingJob } from '../model/home.structure';

export const LOAD_ACTION = createAction(
  '[Home Page] Home Page Accepted Pending Jobs Loading',
);

export const SUCCESS_ACTION = createAction(
  '[Home Page] Home Page Accepted Pending Jobs Success',
  props<{ jobs: AcceptancePendingJob[] }>(),
);

export const ERROR_ACTION = createAction(
  '[Home Page] Home Page Accepted Pending Jobs Error',
  props<{ error: any }>(),
);
