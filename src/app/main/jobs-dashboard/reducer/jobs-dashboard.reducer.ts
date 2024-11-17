import { createReducer, on } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';
import {
  pendingJobs,
  inProgressJobs,
  completedJobs,
  cancelledJobs,
} from '../actions';

export interface JobsDashBoardState {
  jobStage: string;
  pendingJobs: Booking[];
  inProgressJobs: Booking[];
  cancelledJobs: Booking[];
  completedJobs: Booking[];
  completedJobDateRange: any;
  cancelledJobsDateRange: any;
  error: string;
  isLoading: Boolean;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

const initialState: JobsDashBoardState = {
  jobStage: '',
  pendingJobs: [],
  inProgressJobs: [],
  completedJobs: [],
  cancelledJobs: [],
  completedJobDateRange: '',
  cancelledJobsDateRange: '',
  error: '',
  isLoading: false,
};

export const jobDashBoardReducer = createReducer(
  initialState,
  on(pendingJobs.LOAD_ACTION, (state, action) => ({
    ...state,
    pendingJobs: state.pendingJobs,
    isLoading: true,
  })),
  on(pendingJobs.SUCCESS_ACTION, (state, action) => ({
    ...state,
    pendingJobs: state.pendingJobs.concat(action.jobs),
    isLoading: false,
  })),
  on(pendingJobs.ERROR_ACTION, (state, action) => ({
    ...state,
    pendingJobs: [],
    error: action.error,
    isLoading: false,
  })),
  on(inProgressJobs.LOAD_ACTION, (state, action) => ({
    ...state,
    inProgressJobs: state.inProgressJobs,
    isLoading: true,
  })),
  on(inProgressJobs.SUCCESS_ACTION, (state, action) => ({
    ...state,
    inProgressJobs: [...state.inProgressJobs, ...action.jobs],
    isLoading: false,
  })),
  on(inProgressJobs.ERROR_ACTION, (state, action) => ({
    ...state,
    inProgressJobs: [],
    error: action.error,
    isLoading: false,
  })),
  on(completedJobs.LOAD_ACTION, (state, action) => ({
    ...state,
    completedJobs: [],
    completedJobDateRange: action.dateRange,
    isLoading: true,
  })),
  on(completedJobs.SUCCESS_ACTION, (state, action) => ({
    ...state,
    completedJobs: [...state.completedJobs, ...action.jobs],
    isLoading: false,
  })),
  on(completedJobs.ERROR_ACTION, (state, action) => ({
    ...state,
    completedJobs: [],
    error: action.error,
    isLoading: false,
  })),
  on(cancelledJobs.LOAD_ACTION, (state, action) => ({
    ...state,
    cancelledJobs: [],
    cancelledJobsDateRange: action.dateRange,
    isLoading: true,
  })),
  on(cancelledJobs.SUCCESS_ACTION, (state, action) => ({
    ...state,
    cancelledJobs: [...state.cancelledJobs, ...action.jobs],
    isLoading: false,
  })),
  on(cancelledJobs.ERROR_ACTION, (state, action) => ({
    ...state,
    cancelledJobs: [],
    error: action.error,
    isLoading: false,
  })),
);
