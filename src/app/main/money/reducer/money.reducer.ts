import { createReducer, on } from '@ngrx/store';
import {
  changeMonth,
  changeMonthFailure,
  changeMonthSuccess,
} from '../actions/month-change';

export interface MoneyState {
  month: Date;
  totalEarning: number;
  totalDeduction: number;
  netEarning: number;
  history: any[];
  currentSelectedMonthHistory: any[];
  error: string;
  isLoading: Boolean;
}

const initialState: MoneyState = {
  month: new Date(),
  totalEarning: 0,
  totalDeduction: 0,
  netEarning: 0,
  history: [],
  currentSelectedMonthHistory: [],
  error: '',
  isLoading: false,
};

export const moneyReducer = createReducer(
  initialState,
  on(changeMonth, (state, action) => ({
    ...state,
    month: action.date,
    isLoading: true,
  })),
  on(changeMonthFailure, (state, action) => ({
    ...state,
    totalEarning: 0,
    netEarning: 0,
    totalDeduction: 0,
    currentSelectedMonthHistory: [],
    error: action.error,
    isLoading: false,
  })),
  on(changeMonthSuccess, (state, action) => ({
    ...state,
    totalEarning: action.totalEarning,
    totalDeduction: action.totalDeduction,
    netEarning: action.netEarning,
    history: state.history.map((previousBooking) => {
      let duplicateBooking = action.bookings.find(
        (newBooking) => previousBooking.id == newBooking.id,
      );
      if (duplicateBooking) return duplicateBooking;
      else return previousBooking;
    }),
    currentSelectedMonthHistory: action.bookings,
    isLoading: false,
  })),
);
