import { createAction, props } from '@ngrx/store';

export const LOAD_ACTION = createAction(
  '[Home Page] Loading Home Page Working Slots',
);

export const SUCCESS_ACTION = createAction(
  '[Home Page] Home Page Working Slots Loaded',
  props<{workingSlotsData:any }>(),
);

export const ERROR_ACTION = createAction(
  '[Home Page] Home Page Working Slots Loaded Failed',
  props<{ error: string }>(),
);
