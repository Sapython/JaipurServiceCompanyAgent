import { Timestamp } from '@angular/fire/firestore';
import { createAction, props } from '@ngrx/store';

export const LOAD_PROFILE = createAction('[EditProfile] Load Profile');

export const LOADED_PROFILE = createAction(
  '[EditProfile] Loaded Profile',
  props<{
    name: string;
    dateOfBirth: Timestamp;
    phoneNumber: string;
    email: string;
    gender: string;
    photoUrl: string;
  }>(),
);

export const LOAD_PROFILE_ERROR = createAction(
  '[EditProfile] Load Profile Error',
  props<{ error: string }>(),
);

export const UPDATE_PROFILE = createAction(
  '[EditProfile] Update Profile',
  props<{
    name: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
    gender: string;
    photoUrl: string | File;
  }>(),
);

export const PROFILE_UPDATED = createAction('[EditProfile] Profile Updated');

export const UPDATE_PROFILE_ERROR = createAction(
  '[EditProfile] Update Profile Error',
  props<{ error: string }>(),
);
