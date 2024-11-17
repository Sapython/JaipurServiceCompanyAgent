import { createAction, props } from '@ngrx/store';

export const LOAD_ACTION = createAction(
  '[Home Page] Loading Home Page Salutation',
);

export const SUCCESS_ACTION = createAction(
  '[Home Page] Home Page Salutation Loaded',
  props<{ salutation: string; agentName: string }>(),
);

export const ERROR_ACTION = createAction(
  '[Home Page] Home Page Salutation Loaded',
  props<{ error: string }>(),
);
