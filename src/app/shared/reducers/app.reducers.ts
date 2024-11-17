import { createReducer, on } from '@ngrx/store';
import { AppState } from '../models/app.structure';
import {
  errorWhileFetchingUser,
  noUserFound,
  signupRequired,
  userLoaded,
} from '../actions';
import {
  notificationFailed,
  notificationLoaded,
} from '../actions/notification.actions';
import { logout } from 'src/app/main/home/actions/logout.actions';

export const initialState: AppState = {
  currentUser: null,
  agentData: null,
  appStage: 'checkingAuth',
  message: 'Checking for authentication',
  notifications: [],
  unreadNotifications: false,
};

export const appReducer = createReducer(
  initialState,
  on(userLoaded, (state, user) => {
    return {
      ...state,
      currentUser: user.authInstance,
      agentData: user.agentData,
      message: 'User is already logged in',
      appStage: <const>'loggedIn',
    };
  }),
  on(signupRequired, (state, user) => {
    return {
      ...state,
      currentUser: user,
      message: 'User requires a signup',
      appStage: <const>'signupRequired',
    };
  }),
  on(noUserFound, (state) => {
    return {
      ...state,
      currentUser: null,
      message: 'User is logged out',
      appStage: <const>'loginRequired',
    };
  }),
  on(errorWhileFetchingUser, (state, error) => {
    console.log(error);
    return {
      ...state,
      currentUser: null,
      message: error.error,
      appStage: <const>'loginRequired',
    };
  }),
  on(notificationLoaded, (state, action) => {
    return {
      ...state,
      notifications: action.notifications,
      unreadNotifications :action.unreadNotifications 
    };
  }),
  on(notificationFailed, (state, action) => {
    console.log(action.error);
    return {
      ...state,
      notifications: [],
    };
  }),
  on(logout, (state, action) => {
    return {
      ...state,
      currentUser: null,
      message: 'User is logged out',
      appStage: <const>'loginRequired',
    };
  }),
);
