import { createReducer, on } from '@ngrx/store';
import { SignupState } from '../models/signup.structure';
import {
  areasActions,
  citiesActions,
  serviceCatalogue,
  signupActions,
  stateActions,
} from '../actions';

export const initialState: SignupState = {
  categories: [],
  error: null,
  states: [],
  cities: [],
  areas: [],
  pendingUser: {},
  loadingCatalogue: true,
};

export const signupReducer = createReducer(
  initialState,
  on(signupActions.FAILED, (state, { error }) => ({
    ...state,
    error,
  })),
  on(stateActions.SUCCESS, (state, { states }) => ({
    ...state,
    states,
  })),
  on(stateActions.FAILED, (state, { error }) => ({
    ...state,
    error,
  })),
  on(citiesActions.SUCCESS, (state, { cities }) => ({
    ...state,
    cities,
  })),
  on(citiesActions.FAILED, (state, { error }) => ({
    ...state,
    error,
  })),
  on(areasActions.SUCCESS, (state, { areas }) => ({
    ...state,
    areas,
  })),
  on(areasActions.FAILED, (state, { error }) => ({
    ...state,
    error,
  })),
  on(
    signupActions.setBasicDetailsSuccess,
    (
      state,
      {
        name,
        panNumber,
        aadhaarNumber,
        aadhaarImage,
        panImage,
        userImage,
        gender,
        email,
        dateOfBirth,
      },
    ) => ({
      ...state,
      pendingUser: {
        ...state.pendingUser,
        name,
        panNumber,
        aadhaarNumber,
        aadhaarImage,
        panImage,
        userImage,
        gender,
        email,
        dateOfBirth,
      },
    }),
  ),
  on(
    signupActions.setAddressDetails,
    (
      state,
      { state: stateName, city, pincode, area, street, longitude, latitude },
    ) => ({
      ...state,
      pendingUser: {
        ...state.pendingUser,
        state: stateName,
        city,
        pincode,
        area,
        street,
        longitude,
        latitude,
      },
    }),
  ),
  on(serviceCatalogue.SUCCESS, (state, { categories }) => ({
    ...state,
    categories,
    loadingCatalogue: false,
  })),
  on(serviceCatalogue.FAILED, (state) => ({
    ...state,
    loadingCatalogue: false,
  })),
  on(signupActions.selectCategory, (state, { category, subCategory ,area}) => ({
    ...state,
    pendingUser: {
      ...state.pendingUser,
      selectedCategories: state.pendingUser.selectedCategories?.concat({
        categoryId: category.id,
        subCategoryId: subCategory.id,
        areaId : area.id,
        serviceCatalogue : area.serviceCatalogue,
      }) || [
        {
          categoryId: category.id,
          subCategoryId: subCategory.id,
          areaId : area.id,
          serviceCatalogue : area.serviceCatalogue,
        },
      ],
    },
  })),

  on(signupActions.deselectCategory, (state, { category, subCategory,area }) => ({
    ...state,
    pendingUser: {
      ...state.pendingUser,
      selectedCategories: state.pendingUser.selectedCategories?.filter(
        (selectedCategory) =>
          !(
            selectedCategory.categoryId == category.id &&
            selectedCategory.subCategoryId == subCategory.id &&
            selectedCategory.areaId == area.id &&
            selectedCategory.serviceCatalogue == area.serviceCatalogue
          ),
      ),
    },
  })),

  on(signupActions.selectArea, (signupState, { area, state, city }) => ({
    ...signupState,
    pendingUser: {
      ...signupState.pendingUser,
      selectedAreas: signupState.pendingUser.selectedAreas?.concat({
        stateId: state.id,
        cityId: city.id,
        areaId: area.id,
        serviceCatalogue : area.serviceCatalogue
      }) || [
        {
          stateId: state.id,
          cityId: city.id,
          areaId: area.id,
          serviceCatalogue : area.serviceCatalogue
        },
      ],
    },
  })),

  on(signupActions.deselectArea, (signupState, { area, state, city }) => ({
    ...signupState,
    pendingUser: {
      ...signupState.pendingUser,
      selectedAreas: signupState.pendingUser.selectedAreas?.filter(
        (selectedArea) =>
          selectedArea.stateId != state.id &&
          selectedArea.cityId != city.id &&
          selectedArea.areaId != area.id,
      ),
    },
  })),
  on(serviceCatalogue.NO_CATEGORIES, (state, { area }) => ({
    ...state,
    areas: state.areas.filter((a) => a.id != area.id),
  })),
);
