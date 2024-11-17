import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadAreasAction,
  loadAreasFailureAction,
  loadAreasSuccessAction,
  loadInitialJobPreferenceAction,
  loadInitialJobPreferenceSuccessAction,
  submitJobPreference,
  submitJobPreference_failed,
  submitJobPreference_success,
} from '../actions/page.action';
import { from, mergeMap, of, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';
import { JobPreferenceService } from '../services/job-preference.service';
import { catchError, map } from 'rxjs/operators';
import { Area } from 'src/app/auth/signup/models/address.structure';
import { JobsPreferencePageState } from '../models/page.structure';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { HomeState } from '../../home/model/home.structure';

@Injectable()
export class PageEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{
      app: AppState;
      jobsPreference: JobsPreferencePageState;home:HomeState
    }>,
    private jobPreferenceService: JobPreferenceService,
    private router :Router, private menuController: MenuController,
  ) {}
  loadAreasWiseCatlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAreasAction),
      withLatestFrom(this.store.select('app', 'agentData')),
      mergeMap(([action, currentUser]) => {
        if (currentUser == null) {
          return of(loadAreasFailureAction({ error: 'User is not logged in' }));
        }
        return from(
          this.jobPreferenceService.loadAreaWiseServiceCatalogue( currentUser.address.state.id, currentUser.address.city.id,),).pipe(
          map((areasDoc:any) => {
            console.log(areasDoc);
            let filteredAreas = areasDoc.filter((areaDoc:any) => areaDoc['active']);
            return filteredAreas.map((areaDoc:any) => {
              return {
                ...areaDoc,
                active: currentUser.selectedAreas.find((selectedArea) => selectedArea.areaId === areaDoc.id,) ? true : false,
              } as Area;
            });
          }),
          map((areaWiseCatlog) => loadAreasSuccessAction({ areaWiseCatlog })),
          catchError((error) => of(loadAreasFailureAction({ error }))),
        );
      }),
    ),
  );

  loadInitialJobPreference$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadInitialJobPreferenceAction),
    withLatestFrom(
      this.store.select('app', 'agentData'),
      this.store.select('home', 'areaServiceCatlog'),
    ),
    mergeMap(([action, currentUser, areaServiceCatlog]) => {
      if (currentUser == null) {
        return of(loadAreasFailureAction({ error: 'User is not logged in' }));
      }
      return of(
        loadInitialJobPreferenceSuccessAction({
          selectedAreas: this.router.url == '/main/area-jobs' ? [] : currentUser!.selectedAreas,
          selectedCategories: this.router.url == '/main/area-jobs' ? getSelectedJobs(currentUser.selectedJobSubCategories, areaServiceCatlog) : currentUser.selectedJobSubCategories,
        }),
      );
    }),
  ),
);

  submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitJobPreference),
      withLatestFrom(
        this.store.select('jobsPreference'),
        this.store.select('app', 'agentData'),
      ),
      mergeMap(([_, jobsPreference, agentData]) => {
        const uniqueSet = new Set();
        const selectedArea = jobsPreference.selectedCategories
          .filter(item => {
            const key = `${item.areaId}-${item.serviceCatalogue}`;
            if (!uniqueSet.has(key)) {
              uniqueSet.add(key);
              return true;
            }
            return false;
          })
          .map(item => ({ areaId: item.areaId, serviceCatalogue: item.serviceCatalogue,stateId : agentData!.address.state.id,cityId: agentData!.address.city.id, }));
           console.log('Unique Area Ids Array:', selectedArea)
       return from(
          this.jobPreferenceService.saveSelectedCategories(
            agentData!.uid,
            jobsPreference.selectedCategories,
            selectedArea,
          ),
        ).pipe(
          map(() => {
            this.router.navigate(['main/home'])
            this.menuController.open();
            return submitJobPreference_success();
          }),
          catchError((error) => of(submitJobPreference_failed({ error }))),
        );
      }),
    ),
  );
}

function getSelectedJobs(selectedJobSubCategories: any,areaServiceCatlog: any) {
  const resultArray = selectedJobSubCategories.filter(
    (selectedJobSubCategorie: any) =>
      areaServiceCatlog.some(
        (item: any) =>
          item.serviceCatalogue === selectedJobSubCategorie.serviceCatalogue && item.areaId === selectedJobSubCategorie.areaId
      )
  );
  console.log(resultArray);
  return resultArray || [];
}
