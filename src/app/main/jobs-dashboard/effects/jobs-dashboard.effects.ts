import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';
import { BookingService } from '../services/booking.service';
import {
  cancelledJobs,
  completedJobs,
  inProgressJobs,
  pendingJobs,
} from '../actions';
import { Booking } from 'src/app/shared/models/booking.structure';
import { JobsDashBoardState } from '../reducer/jobs-dashboard.reducer';
@Injectable()
export class JobDashboardEffects {
  constructor(
    private actions$: Actions,
    private bookingService: BookingService,
    private store: Store<{ app: AppState; jobDashBoard: JobsDashBoardState }>,
  ) {}

  loadPendingJobs_Data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pendingJobs.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      mergeMap(([_, appState]) => {
        if (appState.currentUser == null) {
          return of(
            pendingJobs.ERROR_ACTION({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.bookingService.getPendingJobs(appState.currentUser.uid),
        ).pipe(
          map((data) =>
            pendingJobs.SUCCESS_ACTION({
              jobs: data,
            }),
          ),
          catchError((error) => {
            console.log(error);
            return of(pendingJobs.ERROR_ACTION({ error }));
          }),
        );
      }),
    ),
  );

  loadInProgressJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(inProgressJobs.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      mergeMap(([_, appState]) => {
        if (appState.currentUser == null) {
          return of(
            inProgressJobs.ERROR_ACTION({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.bookingService.getInProgressJobs(appState.currentUser.uid),
        ).pipe(
          map((data) => inProgressJobs.SUCCESS_ACTION({ jobs: data })),
          catchError((error) => {
            console.log(error);
            return of(inProgressJobs.ERROR_ACTION({ error }));
          }),
        );
      }),
    ),
  );

  loadCompletedJobs_Data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(completedJobs.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      mergeMap(([action, appState]) => {
        console.log('effect date', action.dateRange);

        if (appState.currentUser == null) {
          return of(
            completedJobs.ERROR_ACTION({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.bookingService.getCompletedJobs(
            appState.currentUser.uid,
            action.dateRange,
          ),
        ).pipe(
          map((data) => completedJobs.SUCCESS_ACTION({ jobs: data })),
          catchError((error) => {
            console.log(error);
            return of(completedJobs.ERROR_ACTION({ error }));
          }),
        );
      }),
    ),
  );

  loadCancelledJobs_Data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelledJobs.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      mergeMap(([action, appState]) => {
        if (appState.currentUser == null) {
          return of(
            cancelledJobs.ERROR_ACTION({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.bookingService.getCancelledJobs(
            appState.currentUser.uid,
            action.dateRange,
          ),
        ).pipe(
          map((data) => cancelledJobs.SUCCESS_ACTION({ jobs: data })),
          catchError((error) => {
            console.log(error);
            return of(cancelledJobs.ERROR_ACTION({ error }));
          }),
        );
      }),
    ),
  );
}
