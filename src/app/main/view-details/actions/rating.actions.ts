import { createAction, props } from '@ngrx/store';

export const GiveRating = createAction(
  '[ViewDetails] Give Rating',
  props<{ rating: any }>(),
);

export const GiveRating_FAILED = createAction(
  '[ViewDetails] GiveRating Failed',
  props<{ error: any }>(),
);

export const GiveRating_SUCCESSFUL = createAction(
  '[ViewDetails] Give Rating Successful',
);
