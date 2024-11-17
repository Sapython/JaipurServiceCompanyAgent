import { createReducer, on } from '@ngrx/store';
import {
  contactLoad,
  contactsLoadFailure,
  contactsLoadSuccess,
} from '../actions/contact';

export interface ContactState {
  contacts: any[];
  error: string;
  isLoading: Boolean;
}

const initialState: ContactState = {
  contacts: [],
  error: '',
  isLoading: false,
};

export const contactReducer = createReducer(
  initialState,
  on(contactLoad, (state, action) => ({
    ...state,
    contacts: [],
    isLoading: true,
  })),
  on(contactsLoadFailure, (state, action) => ({
    ...state,
    contacts: [],
    error: action.error,
    isLoading: false,
  })),
  on(contactsLoadSuccess, (state, action) => ({
    ...state,
    contacts: action.contacts,
    isLoading: false,
  })),
);
