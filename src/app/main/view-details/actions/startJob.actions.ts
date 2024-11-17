import { createAction, props } from '@ngrx/store';

export const START = createAction(
  '[ViewDetails] Start Job',
  props<{ image: Blob }>(),
);

export const FAILED = createAction(
  '[ViewDetails] Start Job Failed',
  props<{ error: any }>(),
);

export const SUCCESSFUL = createAction('[ViewDetails] Job Started');
