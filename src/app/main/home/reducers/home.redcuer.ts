import { createReducer, on } from '@ngrx/store';
import { HomeState } from '../model/home.structure';
import {
  acceptJob,
  acceptedJobs,
  acceptedPending,
  areaCatlog,
  rejectJob,
  workingSlots,
} from '../actions';

export const initialState: HomeState = {
  acceptancePendingJobs: [],
  loadingPendingJobs: false,
  acceptedJobs: [],
  loadingAcceptedJobs: false,
  customerName: '',
  salutation: 'Good Morning',
  workingHours: null,
  acceptPendingJobflag: false,
  workingSlotsData:{},
  areaServiceCatlog:[]
};

export const homeReducer = createReducer(
  initialState,
  on(acceptedPending.SUCCESS_ACTION, (state, action) => ({
    ...state,
    acceptancePendingJobs: action.jobs,
    loadingPendingJobs: false,
  })),
  on(acceptedPending.ERROR_ACTION, (state, action) => ({
    ...state,
    acceptancePendingJobs: [],
    error: action.error,
    loadingPendingJobs: false,
  })),
  on(acceptedPending.LOAD_ACTION, (state, action) => ({
    ...state,
    acceptancePendingJobs: [],
    loadingPendingJobs: true,
  })),
  on(acceptedJobs.LOAD_ACTION, (state, action) => ({
    ...state,
    acceptedJobs: [],
    loadingAcceptedJobs: true,
  })),
  on(acceptedJobs.SUCCESS_ACTION, (state, action) => ({
    ...state,
    acceptedJobs: action.jobs,
    loadingAcceptedJobs: false,
  })),
  on(acceptedJobs.ERROR_ACTION, (state, action) => ({
    ...state,
    acceptedJobs: [],
    error: action.error,
    loadingAcceptedJobs: false,
  })),
  // pending jobs
  on(acceptJob.SUCCESSFUL, (state, action) => ({
    ...state,
    acceptancePendingJobs: state.acceptancePendingJobs.filter(
      (job) => job.id !== action.job.id,
    ),
    // acceptedJobs: [...state.acceptedJobs, action.job.bookingData],
  })),
  on(rejectJob.SUCCESSFUL, (state, action) => ({
    ...state,
    acceptancePendingJobs: state.acceptancePendingJobs.filter(
      (job) => job.id !== action.job.id,
    ),
  })),
  on(acceptJob.FAILED, (state, action) => ({
    ...state,
    error: action.error,
  })),
  on(rejectJob.FAILED, (state, action) => ({
    ...state,
    error: action.error,
  })),
  //load slots
  on(workingSlots.LOAD_ACTION, (state, action) => ({
    ...state,
    workingSlotsData: {},
  })),
  on(workingSlots.SUCCESS_ACTION, (state, action) => ({
    ...state,
    workingSlotsData: action.workingSlotsData,
  })),
  on(workingSlots.ERROR_ACTION, (state, action) => ({
    ...state,
    workingSlotsData: {},
    error: action.error,
  })),
  on(areaCatlog.loadAreasAction, (state, action) => ({
    ...state,
    areaServiceCatlog: [],
  })),
  on(areaCatlog.loadAreasSuccessAction, (state, action) => ({
    ...state,
    areaServiceCatlog: action.areaServiceCatlog,
  })),
  on(areaCatlog.loadAreasFailureAction, (state, action) => ({
    ...state,
    areaServiceCatlog: [],
    error: action.error,
  })),
);
