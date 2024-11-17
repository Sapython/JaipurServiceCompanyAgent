import { createReducer, on } from '@ngrx/store';
import { ViewDetailsState } from '../models/viewDetails.structure';
import { initial, pictureAfterWork, pictureBeforeWork } from '../actions';

export const initialState: ViewDetailsState = {
  booking: undefined,
  loadingBooking: true,
  pictureBeforeWork: [],
  pictureAfterWork: [],
};

export const viewDetailsReducer = createReducer(
  initialState,
  on(initial.cacheLoaded, (state, { booking }) => ({
    ...state,
    booking,
    loadingBooking: false,
    pictureAfterWork: booking.picsAfter || [],
    pictureBeforeWork: booking.picsBefore || [],
  })),

  on(initial.loadBookingSuccess, (state, { booking }) => ({
    ...state,
    booking,
    pictureAfterWork: booking.picsAfter || [],
    pictureBeforeWork: booking.picsBefore || [],
    loadingBooking: false,
  })),
  on(pictureAfterWork.ADD_IMAGE, (state, action) => ({
    ...state,
    pictureAfterWork: [...state.pictureAfterWork, action.image],
  })),
  on(pictureBeforeWork.ADD_IMAGE, (state, action) => ({
    ...state,
    pictureBeforeWork: [...state.pictureBeforeWork, action.image],
  })),
  on(pictureAfterWork.REMOVE_IMAGE, (state, action) => ({
    ...state,
    pictureAfterWork: state.pictureAfterWork.filter(
      (_, i) => i !== action.index,
    ),
  })),
  on(pictureBeforeWork.REMOVE_IMAGE, (state, action) => ({
    ...state,
    pictureBeforeWork: state.pictureBeforeWork.filter(
      (_, i) => i !== action.index,
    ),
  })),
  on(pictureBeforeWork.SAVE_IMAGES_SUCCESSFUL, (state, action) => ({
    ...state,
    pictureBeforeWork: action.images,
  })),
  on(pictureAfterWork.SAVE_IMAGES_SUCCESSFUL, (state, action) => ({
    ...state,
    pictureAfterWork: action.images,
  })),
);
