import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  LOADED_PROFILE,
  LOAD_PROFILE,
  LOAD_PROFILE_ERROR,
} from '../actions/edit-profile.actions';
import { mergeMap, of, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';

@Injectable()
export class EditProfileService {
  constructor(
    private actions$: Actions,
    private store: Store<{ appState: AppState }>,
  ) {}

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_PROFILE),
      withLatestFrom(this.store.select('appState', 'agentData')),
      mergeMap(([action, agentData]) => {
        if (!agentData) {
          return of(LOAD_PROFILE_ERROR({ error: 'Agent data not found' }));
        }
        return of(
          LOADED_PROFILE({
            dateOfBirth: agentData.dateOfBirth,
            email: agentData.email,
            gender: agentData.gender,
            name: agentData.name,
            phoneNumber: agentData.phoneNumber,
            photoUrl: agentData.photoUrl,
          }),
        );
      }),
    ),
  );
}
