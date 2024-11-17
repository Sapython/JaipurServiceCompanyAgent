import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { MoneyService } from '../services/money.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';
import {
  changeMonth,
  changeMonthFailure,
  changeMonthSuccess,
} from '../actions/month-change';
import {
  calculateNetEarning,
  calculateTotalDeduction,
  calculateTotalEarning,
} from './calculation';
@Injectable()
export class MoneyEffects {
  constructor(
    private actions$: Actions,
    private moneyService: MoneyService,
    private store: Store<{ app: AppState }>,
  ) {}
  loadMoneyObj = createEffect(() =>
    this.actions$.pipe(
      ofType(changeMonth),
      withLatestFrom(this.store.select('app')),
      mergeMap(([action, appState]) => {
        if (appState.currentUser == null) {
          return of(
            changeMonthFailure({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.moneyService.loadCompletedJobs(
            appState.currentUser.uid,
            action.date,
          ),
        ).pipe(
          map((data) =>
            changeMonthSuccess({
              bookings: data,
              totalEarning: calculateTotalEarning(data),
              totalDeduction: calculateTotalDeduction(data),
              netEarning: calculateNetEarning(data),
            }),
          ),
          catchError((error: any) => {
            console.log(error);
            return of(changeMonthFailure({ error: error }));
          }),
        );
      }),
    ),
  );
}
