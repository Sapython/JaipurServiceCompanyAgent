import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HomeService } from '../services/home.service';

import {
  catchError,
  mergeMap,
  from,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';
import {
  acceptJob,
  acceptedJobs,
  acceptedPending,
  areaCatlog,
  homePageSalutation,
  rejectJob,
  workingSlots,
} from '../actions';
import { Booking } from 'src/app/shared/models/booking.structure';
import { ViewDetailsService } from '../../view-details/services/view-details.service';
import { SplashscreenService } from 'src/app/shared/services/splashscreen.service';
import { Router } from '@angular/router';
import { JobPreferenceService } from '../../jobs-preference/services/job-preference.service';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,private splashScreenService: SplashscreenService,private router : Router,
    private homeService: HomeService,
    private store: Store<{ app: AppState }>,
    private viewDetailsService: ViewDetailsService,private jobPreferenceService : JobPreferenceService
  ) {}

  loadHomePage_PendingJobs_Data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptedPending.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      mergeMap(([_, appState]) => {
        if (appState.currentUser == null) {
          return of(
            acceptedPending.ERROR_ACTION({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.homeService.loadAcceptancePendingJobs(appState.currentUser.uid),
        ).pipe(
          map((data) => acceptedPending.SUCCESS_ACTION({ jobs: data })),
          catchError((error) => {
            console.error(error);
            return of(acceptedPending.ERROR_ACTION({ error }));
          }),
        );
      }),
    ),
  );

  loadHomePage_AcceptedJobs_Data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptedJobs.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      mergeMap(([_, appState]) => {
        if (appState.currentUser == null) {
          return of(
            acceptedJobs.ERROR_ACTION({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.homeService.loadAcceptedJobs(appState.currentUser.uid),
        ).pipe(
          map((data) => data as Booking[]),
          map((data) => acceptedJobs.SUCCESS_ACTION({ jobs: data })),
          catchError((error) => {
             console.log(error)
             return of(acceptedJobs.ERROR_ACTION({ error })
             )}
          ),
        );
      }),
    ),
  );

  loadHomePage_Salutation_Data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homePageSalutation.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      map(([_, appState]) => {
        if (appState.currentUser != null && appState.currentUser.displayName) {
          return homePageSalutation.SUCCESS_ACTION({
            agentName: appState.currentUser.displayName,
            salutation: getSalutation(),
          });
        } else {
          return homePageSalutation.ERROR_ACTION({
            error:
              "No User is logged in or the user doesn't have a display name",
          });
        }
      }),
    ),
  );

  acceptJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptJob.ACCEPT),
      withLatestFrom(this.store.select('app', 'agentData')),
      mergeMap(([action, agentData]) => {
        if (agentData == null) {
          return of(acceptJob.FAILED({ error: 'User is not logged in' }));
        }
        return from(
          this.viewDetailsService.acceptJob(
            agentData.uid,
            action.job.customerId,
            action.job,
            agentData.perDayJobs
          ),
        ).pipe(
          map(() => acceptJob.SUCCESSFUL({ job: action.job })),
          catchError((error) => {
            console.error(error);
            return of(acceptJob.FAILED({ error }));
          }),
        );
      }),
    ),
  );

  rejectJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectJob.REJECT),
      withLatestFrom(this.store.select('app', 'currentUser')),
      mergeMap(([action, currentUser]) => {
        console.log('Rejecting Job', action.job);
        if (currentUser == null) {
          return of(rejectJob.FAILED({ error: 'User is not logged in' }));
        }
        return from(
          this.viewDetailsService.rejectJob(action.job.customerId, action.job),
        ).pipe(
          map(() => rejectJob.SUCCESSFUL({ job: action.job })),
          catchError((error) => {
            console.error(error);
            return of(rejectJob.FAILED({ error }));
          }),
        );
      }),
    ),
  );
  loadHomePage_Working_Days_Data$ = createEffect(() =>
  this.actions$.pipe(
    ofType(workingSlots.LOAD_ACTION),
      withLatestFrom(this.store.select('app')),
      mergeMap(([_, appState]) => {
        if (appState.currentUser == null) {
          return of(
            workingSlots.ERROR_ACTION({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.homeService.getWorkingSlotsData(appState.currentUser.uid),
        ).pipe(
          map((data) => workingSlots.SUCCESS_ACTION({ workingSlotsData: data })),
          catchError((error) => {
            console.error(error);
            return of(workingSlots.ERROR_ACTION({ error }));
          }),
        );
      }),
  ),
);

areas$ = createEffect(() =>
  this.actions$.pipe(
    ofType(areaCatlog.loadAreasAction),
    withLatestFrom(this.store.select('app', 'agentData')),
    switchMap(([action, currentUser]) => {
      if (currentUser == null) {
        return of(areaCatlog.loadAreasFailureAction({ error: 'User is not logged in' }));
      }
      return from(
        this.jobPreferenceService.loadAreas(currentUser.address.state.id, currentUser.address.city.id),
      ).pipe(
        map((areasDoc) => {
          let filteredAreasWithIds = areasDoc.docs.filter((areaDoc) => areaDoc.data()['active']).map((areaDoc) => ({ areaId: areaDoc.id, serviceCatalogue: areaDoc.data()['serviceCatalogue'] })); 
          console.log(filteredAreasWithIds);
          let allSelectedExist = currentUser.selectedAreas.every((selectedArea) => filteredAreasWithIds.some((area:any) => area.areaId === selectedArea.areaId && area.serviceCatalogue === selectedArea.serviceCatalogue ));
          if (!allSelectedExist) {
            this.splashScreenService.hideSplashScreen();
            this.router.navigate(['/main/area-jobs']);
          }

          return areaCatlog.loadAreasSuccessAction({ areaServiceCatlog: filteredAreasWithIds }); // Adjust this line to return an action
        }),
        catchError((error) => of(areaCatlog.loadAreasFailureAction({ error })))
      );
    }),
  )
);
}

function getSalutation() {
  const hours = new Date().getHours();
  if (hours >= 0 && hours <= 11) {
    return 'Good Morning';
  } else if (hours >= 12 && hours <= 16) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}
