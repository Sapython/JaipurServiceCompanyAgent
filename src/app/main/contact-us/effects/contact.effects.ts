import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ContactService } from '../services/contact.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';
import {
  contactLoad,
  contactsLoadFailure,
  contactsLoadSuccess,
} from '../actions/contact';
@Injectable()
export class ContactEffects {
  constructor(
    private actions$: Actions,
    private contactService: ContactService,
    private store: Store<{ app: AppState }>,
  ) {}
  loadContactObj = createEffect(() =>
    this.actions$.pipe(
      ofType(contactLoad),
      withLatestFrom(this.store.select('app')),
      mergeMap(([_, appState]) => {
        if (appState.currentUser == null) {
          return of(
            contactsLoadFailure({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.contactService.loadContacts(appState.currentUser.uid),
        ).pipe(
          map((data) => contactsLoadSuccess({ contacts: data })),
          catchError((error: any) => {
            console.log(error);
            return of(contactsLoadFailure({ error: error }));
          }),
        );
      }),
    ),
  );
}
