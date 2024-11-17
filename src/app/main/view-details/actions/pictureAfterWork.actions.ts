import { createAction, props } from '@ngrx/store';

export const ADD_IMAGE = createAction(
  '[ViewDetails] [After Work] Add Images',
  props<{ image: string; bookingId: string }>(),
);

export const REMOVE_IMAGE = createAction(
  '[ViewDetails] [After Work] Remove Image',
  props<{ index: number }>(),
);

export const SAVE_IMAGES = createAction(
  '[ViewDetails] [After Work] Save Images',
  props<{ bookingId: string }>(),
);

export const SAVE_IMAGES_SUCCESSFUL = createAction(
  '[ViewDetails] [After Work] Save Images Successful',
  props<{ images: string[] }>(),
);

export const SAVE_IMAGES_FAILED = createAction(
  '[ViewDetails] [After Work] Save Images Failed',
  props<{ error: any }>(),
);

export const SKIP_PICTURE = createAction('[ViewDetails] Skip Picture');
