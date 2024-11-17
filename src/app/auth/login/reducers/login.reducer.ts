import { createReducer, on } from '@ngrx/store';
import { LoginPageState } from '../models/login.structure';
import {
  loginWithPhoneAction,
  loginWithPhoneFailedAction,
  loginWithPhoneSuccessAction,
} from '../actions/login.actions';

export const initialState: LoginPageState = {
  errorMessage: '',
  errorOccurred: false,
  phoneNumber: '',
};

export const loginPageReducer = createReducer(
  initialState,
  on(loginWithPhoneFailedAction, (state, action) => {
    return {
      ...state,
      errorOccurred: true,
      errorMessage: action.errorMessage,
    };
  }),
  on(loginWithPhoneAction, (state, action) => {
    return {
      ...state,
      errorOccurred: false,
      errorMessage: '',
      phoneNumber: action.phoneNumber,
    };
  }),
);
