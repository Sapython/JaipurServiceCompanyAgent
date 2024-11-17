import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, createReducer } from '@ngrx/store';
import {
  completeJob,
  initial,
  otp,
  pictureAfterWork,
  pictureBeforeWork,
  rating,
  startJob,
} from '../actions';
import {
  catchError,
  from,
  map,
  merge,
  mergeMap,
  of,
  withLatestFrom,
} from 'rxjs';
import { HomeState } from '../../home/model/home.structure';
import { JobsDashBoardState } from '../../jobs-dashboard/reducer/jobs-dashboard.reducer';
import { ViewDetailsService } from '../services/view-details.service';
import { Booking } from 'src/app/shared/models/booking.structure';
import { ViewDetailsState } from '../models/viewDetails.structure';
import { Router } from '@angular/router';

@Injectable()
export class ViewDetailsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{
      home: HomeState;
      jobDashBoard: JobsDashBoardState;
      viewDetails: ViewDetailsState;
    }>,
    private viewDetails: ViewDetailsService,
    private router: Router,
  ) {}

  loadInitialCachedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initial.loadBooking),
      withLatestFrom(
        this.store.select('home', 'acceptedJobs'),
        this.store.select('home', 'acceptancePendingJobs'),
        this.store.select('jobDashBoard', 'pendingJobs'),
        this.store.select('jobDashBoard', 'inProgressJobs'),
        this.store.select('jobDashBoard', 'completedJobs'),
        this.store.select('jobDashBoard', 'cancelledJobs'),
      ),
      mergeMap(
        ([
          action,
          acceptedJobs,
          acceptancePendingJobs,
          pendingJobs,
          inProgressJobs,
          completedJobs,
          cancelledJobs,
        ]) => {
          // find the booking in this order and when found return it
          // acceptedJobs
          // acceptancePendingJobs
          // pendingJobs
          // inProgressJobs
          // completedJobs
          // cancelledJobs
          let booking = acceptedJobs?.find(
            (booking) => booking.id === action.id,
          );
          if (booking) this.store.dispatch(initial.cacheLoaded({ booking }));
          booking = acceptancePendingJobs?.find(
            (booking) => booking.id === action.id,
          )?.bookingData;
          if (booking) this.store.dispatch(initial.cacheLoaded({ booking }));
          booking = pendingJobs?.find((booking) => booking.id === action.id);
          if (booking) this.store.dispatch(initial.cacheLoaded({ booking }));
          booking = inProgressJobs?.find((booking) => booking.id === action.id);
          if (booking) this.store.dispatch(initial.cacheLoaded({ booking }));
          booking = completedJobs?.find((booking) => booking.id === action.id);
          if (booking) this.store.dispatch(initial.cacheLoaded({ booking }));
          booking = cancelledJobs?.find((booking) => booking.id === action.id);
          if (booking) this.store.dispatch(initial.cacheLoaded({ booking }));
          return of(
            initial.loadUpdatedBooking({
              id: action.id,
              customerId: action.customerId,
            }),
          );
        },
      ),
    ),
  );

  loadUpdatedBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initial.loadUpdatedBooking),
      mergeMap((action) => {
        return from(
          this.viewDetails.getBooking(action.customerId, action.id),
        ).pipe(
          map((booking) => {
            return booking as Booking;
          }),
          map((booking) => {
            return initial.loadBookingSuccess({ booking });
          }),
        );
      }),
    ),
  );

  startJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startJob.START),
      withLatestFrom(this.store.select('viewDetails', 'booking')),
      mergeMap(([action, booking]) => {
        if (!booking) {
          return of(startJob.FAILED({ error: 'Booking not found' }));
        }
        return from(
          this.viewDetails.startJob(booking?.currentUser.userId, booking),
        ).pipe(
          map((booking) => {
            return startJob.SUCCESSFUL();
          }),
          catchError((error) => {
            console.error(error);
            return of(startJob.FAILED({ error }));
          }),
        );
      }),
    ),
  );

  navigateToVerifyOtp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(startJob.SUCCESSFUL),
        withLatestFrom(this.store.select('viewDetails', 'booking')),
        map(([action, booking]) => {
          this.router.navigate(['main', 'verify-otp',booking?.currentUser.userId, booking?.id]);
        }),
      ),
    { dispatch: false },
  );

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(otp.VALIDATE),
      withLatestFrom(this.store.select('viewDetails', 'booking')),
      mergeMap(([action, booking]) => {
        if (!booking) {
          return of(otp.VALIDATION_FAILED({ error: 'Booking not found' }));
        }
        return from(
          this.viewDetails.validateOtp(
            booking?.currentUser.userId,
            booking,
            action.otp,
          ),
        ).pipe(
          map((booking) => {
            return otp.VALIDATION_SUCCESSFUL();
          }),
          catchError((error) => {
            console.error(error);
            return of(otp.VALIDATION_FAILED({ error }));
          }),
        );
      }),
    ),
  );

  navigateToJobInProgress$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(otp.VALIDATION_SUCCESSFUL),
        withLatestFrom(this.store.select('viewDetails', 'booking')),
        map(([action, booking]) => {
          this.router.navigate([
            'main',
            'view-details',
            booking?.currentUser.userId,
            booking?.id,booking?.stage
          ]);
        }),
      ),
    { dispatch: false },
  );

  saveBeforeWorkImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pictureBeforeWork.SAVE_IMAGES),
      withLatestFrom(
        this.store.select('viewDetails', 'booking'),
        this.store.select('viewDetails', 'pictureBeforeWork'),
      ),
      mergeMap(([action, currentBooking, picturesBeforeWork]) => {
        if (!currentBooking) {
          throw Error('Current booking is undefined');
        }
        return from(
          this.viewDetails.saveWorkImages(
            currentBooking.currentUser.userId,
            currentBooking.id!,
            picturesBeforeWork,
            'beforeWork',
          ),
        ).pipe(
          map((images) => {
            return pictureBeforeWork.SAVE_IMAGES_SUCCESSFUL({ images: images });
          }),
          catchError((error) => {
            console.error(error);
            return of(pictureBeforeWork.SAVE_IMAGES_FAILED({ error }));
          }),
        );
      }),
    ),
  );

  saveAfterWorkImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pictureAfterWork.SAVE_IMAGES),
      withLatestFrom(
        this.store.select('viewDetails', 'booking'),
        this.store.select('viewDetails', 'pictureAfterWork'),
      ),
      mergeMap(([action, currentBooking, picturesAfterWork]) => {
        if (!currentBooking) {
          throw Error('Current booking is undefined');
        }
        return from(
          this.viewDetails.saveWorkImages(
            currentBooking.currentUser.userId,
            currentBooking.id!,
            picturesAfterWork,
            'afterWork',
          ),
        ).pipe(
          map((images) => {
            return pictureAfterWork.SAVE_IMAGES_SUCCESSFUL({ images: images });
          }),
          catchError((error) => {
            console.error(error);
            return of(pictureAfterWork.SAVE_IMAGES_FAILED({ error }));
          }),
        );
      }),
    ),
  );

  navigateToInvoice$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(pictureAfterWork.SAVE_IMAGES_SUCCESSFUL),
        map(() => {
          this.router.navigate(['main', 'invoice']);
        }),
      ),
    { dispatch: false },
  );

  completeJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(completeJob.COMPLETE),
      withLatestFrom(this.store.select('viewDetails', 'booking')),
      mergeMap(([action, currentBooking]) => {
        if (!currentBooking) {
          throw Error('Current booking is undefined');
        }
        return from(
          this.viewDetails.completeJob(
            currentBooking!.currentUser.userId,
            currentBooking?.id!,
          ),
        ).pipe(
          map(() => {
            return completeJob.SUCCESSFUL();
          }),
          catchError((error) => {
            console.error(error);
            return of(completeJob.FAILED({ error }));
          }),
        );
      }),
    ),
  );
  saveJobRating$ = createEffect(() =>
  this.actions$.pipe(
    ofType(rating.GiveRating),
    withLatestFrom(this.store.select('viewDetails', 'booking')),
    mergeMap(([action, booking]) => {
      if (!booking) {
        return of(rating.GiveRating_FAILED({ error: 'Booking not found' }));
      }
      return from(
        this.viewDetails.saveRating(
          booking?.currentUser.userId,
          booking,
          action.rating,
        ),
      ).pipe(
        map((booking) => {
          return rating.GiveRating_SUCCESSFUL();
        }),
        catchError((error) => {
          console.error(error);
          return of(rating.GiveRating_FAILED({ error }));
        }),
      );
    }),
  ),
);
}
