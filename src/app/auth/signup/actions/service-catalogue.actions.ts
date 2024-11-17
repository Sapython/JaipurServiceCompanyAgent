import { createAction, props } from '@ngrx/store';
import { Category } from 'src/app/shared/models/category.structure';
import { Area } from '../models/address.structure';

export const LOAD = createAction('[Signup] Load Service Catalogue');

export const SUCCESS = createAction(
  '[Signup] Load Service Catalogue Success',
  props<{ categories: Category[] }>(),
);

export const FAILED = createAction(
  '[Signup] Load Service Catalogue Failed',
  props<{ error: string }>(),
);

export const NO_CATEGORIES = createAction(
  '[Signup] No Service Found under the current area',
  props<{ area: Area }>(),
);
