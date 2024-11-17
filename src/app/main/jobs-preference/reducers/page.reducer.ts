import { createReducer, on } from '@ngrx/store';
import { JobsPreferencePageState } from '../models/page.structure';
import {
  deselectCategory,
  loadAreasAction,
  loadAreasFailureAction,
  loadAreasSuccessAction,
  loadInitialJobPreferenceSuccessAction,
  selectCategory,
} from '../actions/page.action';

export const initialState: JobsPreferencePageState = {
  areaWiseCatlog: [],
  selectedAreas: [],
  selectedCategories: [],
  loadingAreaWiseCatlog: true,
};

export const jobsPreferencePageReducer = createReducer(
  initialState,
  on(loadAreasAction, (state) => ({ ...state, loadingAreaWiseCatlog: true })),
  on(loadAreasSuccessAction, (state, { areaWiseCatlog }) => ({
    ...state,
    areaWiseCatlog,
    loadingAreaWiseCatlog: false,
  })),
  on(loadAreasFailureAction, (state, { error }) => ({
    ...state,
    error,
    loadingAreaWiseCatlog: false,
  })),
  on(selectCategory, (state, { category, subCategory, area}) => ({
    ...state,
    selectedCategories: state.selectedCategories?.concat({
      categoryId: category.id,
      subCategoryId: subCategory.id,
      areaId : area.id,
      serviceCatalogue : area.serviceCatalogue,
    }) || [
      {
        categoryId: category.id,
        subCategoryId: subCategory.id,
        areaId : area.id,
        serviceCatalogue : area.serviceCatalogue
      },
    ],
  })),
  on(
    loadInitialJobPreferenceSuccessAction,
    (state, { selectedAreas, selectedCategories }) => ({
      ...state,
      selectedAreas,
      selectedCategories,
    }),
  ),

  on(deselectCategory, (state, { category, subCategory,area }) => ({
    ...state,
    selectedCategories: state.selectedCategories?.filter(
      (selectedCategory) =>
        !(
          selectedCategory.categoryId == category.id &&
          selectedCategory.subCategoryId == subCategory.id &&
          selectedCategory.areaId == area.id &&
          selectedCategory.serviceCatalogue == area.serviceCatalogue
        ),
    ),
  })),
);
