import { createAction, props } from '@ngrx/store';
import {
  Category,
  SubCategory,
} from 'src/app/shared/models/category.structure';
import { Area, City, State } from '../models/address.structure';
import { Timestamp } from '@angular/fire/firestore';

export const FAILED = createAction(
  '[Signup] Signup Load Failed',
  props<{ error: any }>(),
);

export const setBasicDetails = createAction(
  '[Signup] Set Basic Details',
  props<{
    name: string;
    panNumber: string;
    aadhaarNumber: string;
    aadhaarImage: File;
    panImage: File;
    userImage: File;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: Timestamp;
    email: string;
  }>(),
);

export const setBasicDetailsSuccess = createAction(
  '[Signup] Set Basic Details Success',
  props<{
    name: string;
    panNumber: string;
    aadhaarNumber: string;
    aadhaarImage: string;
    panImage: string;
    userImage: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: Timestamp;
    email: string;
  }>(),
);

export const navigateToAddressDetails = createAction(
  '[Signup] Navigate To Address Details',
);

export const setAddressDetails = createAction(
  '[Signup] Set Address Details',
  props<{
    state: State;
    city: City;
    pincode: string;
    area: Area;
    street: string;
    longitude: number;
    latitude: number;
  }>(),
);

export const navigateToCategoryDetails = createAction(
  '[Signup] Navigate To Category Details',
);

export const selectCategory = createAction(
  '[Signup] Select Category',
  props<{ category: Category; subCategory: SubCategory ; area:Area }>(),
);

export const deselectCategory = createAction(
  '[Signup] Deselect Category',
  props<{ category: Category; subCategory: SubCategory; area:Area }>(),
);

export const selectArea = createAction(
  '[Signup] Select Area',
  props<{ area: Area; state: State; city: City }>(),
);

export const deselectArea = createAction(
  '[Signup] Deselect Area',
  props<{ area: Area; state: State; city: City }>(),
);

export const completeSignup = createAction('[Signup] Complete Signup');

export const completeSignupSuccess = createAction(
  '[Signup] Complete Signup Success',
);
