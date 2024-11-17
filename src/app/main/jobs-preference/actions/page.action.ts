import { createAction, props } from '@ngrx/store';
import {
  Area,
  City,
  State,
} from 'src/app/auth/signup/models/address.structure';
import {
  Category,
  SubCategory,
} from 'src/app/shared/models/category.structure';

export const loadInitialJobPreferenceAction = createAction(
  '[JobsPreferencePage] Load Jobs Preference Page State',
);
export const loadInitialJobPreferenceSuccessAction = createAction(
  '[JobsPreferencePage] Load Jobs Preference Success Page State',
  props<{
    selectedCategories: {
      categoryId: string;
      subCategoryId: string;
      areaId: string;
      serviceCatalogue : string;
    }[];
    selectedAreas: {
      stateId: string;
      cityId: string;
      areaId: string;
      serviceCatalogue : string;
    }[];
  }>(),
);
export const loadAreasAction = createAction('[JobsPreferencePage] Load Areas');
export const loadCategoriesAction = createAction(
  '[JobsPreferencePage] Load Categories',
);
export const loadAreasSuccessAction = createAction(
  '[JobsPreferencePage] Load Areas Success',
  props<{ areaWiseCatlog: Area[] }>(),
);
export const loadCategoriesSuccessAction = createAction(
  '[JobsPreferencePage] Load Categories Success',
  props<{ categories: Category[] }>(),
);
export const loadAreasFailureAction = createAction(
  '[JobsPreferencePage] Load Areas Failure',
  props<{ error: string }>(),
);
export const loadCategoriesFailureAction = createAction(
  '[JobsPreferencePage] Load Categories Failure',
  props<{ error: string }>(),
);

export const selectCategory = createAction(
  '[JobsPreferencePage] Select Category',
  props<{ category: Category; subCategory: SubCategory ; area :any}>(),
);

export const deselectCategory = createAction(
  '[JobsPreferencePage] Deselect Category',
  props<{ category: Category; subCategory: SubCategory ; area :any}>(),
);

export const selectArea = createAction(
  '[JobsPreferencePage] Select Area',
  props<{ area: Area; state: State; city: City }>(),
);

export const deselectArea = createAction(
  '[JobsPreferencePage] Deselect Area',
  props<{ area: Area; state: State; city: City }>(),
);

export const submitJobPreference = createAction(
  '[JobsPreferencePage] Submit Job Preference',
);

export const submitJobPreference_success = createAction(
  '[JobsPreferencePage] Submit Job Preference Success',
);

export const submitJobPreference_failed = createAction(
  '[JobsPreferencePage] Submit Job Preference Failed',
  props<{ error: string }>(),
);
