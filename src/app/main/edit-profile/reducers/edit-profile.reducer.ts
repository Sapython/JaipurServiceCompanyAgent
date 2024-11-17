import { createReducer, on } from '@ngrx/store';
import { EditProfileState } from '../models/edit-profile.structure';
import { LOADED_PROFILE } from '../actions/edit-profile.actions';

export const initialState: { user: EditProfileState | null } = {
  user: null,
};

export const editProfileReducer = createReducer(
  initialState,
  on(LOADED_PROFILE, (state, action) => {
    return {
      user: {
        dateOfBirth: action.dateOfBirth,
        email: action.email,
        gender: action.gender,
        name: action.name,
        photoUrl: action.photoUrl,
      },
    };
  }),
);
