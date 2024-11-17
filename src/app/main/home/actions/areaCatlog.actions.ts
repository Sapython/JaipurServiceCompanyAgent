import { createAction, props } from '@ngrx/store';
import { Area } from 'src/app/auth/signup/models/address.structure';

export const loadAreasAction = createAction('[Home Page] Load Areas Catlog');

export const loadAreasSuccessAction = createAction(
  '[Home Page] Load Areas Catlog Success',
  props<{ areaServiceCatlog: any[] }>(),
);
export const loadAreasFailureAction = createAction(
  '[Home Page] Load Areas Catlog Failure',
  props<{ error: string }>(),
);
