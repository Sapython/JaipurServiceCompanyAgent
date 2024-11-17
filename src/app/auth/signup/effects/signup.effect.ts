import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { SignupService } from '../services/signup.service';
import { serviceCatalogue, signupActions } from '../actions';
import { setBasicDetails } from '../actions/signup.actions';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AppState } from 'src/app/shared/models/app.structure';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { SignupState } from '../models/signup.structure';
import { Area } from '../models/address.structure';

@Injectable()
export class SignupEffects {
  constructor(
    private actions: Actions,
    private signupService: SignupService,
    private toastService: ToastService,
    private store: Store<{ app: AppState; signup: SignupState }>,
    private router: Router,
  ) {}

  setBasicDetails$ = createEffect(() =>
    this.actions.pipe(
      ofType(setBasicDetails),
      withLatestFrom(this.store.select('app', 'currentUser')),
      mergeMap(([action, currentUser]) => {
        if (currentUser == null) {
          return of(
            signupActions.FAILED({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          this.signupService.uploadBasicDetails(
            action.aadhaarImage,
            action.panImage,
            action.userImage,
            currentUser.uid,
          ),
        ).pipe(
          map((data) =>
            signupActions.setBasicDetailsSuccess({
              name: action.name,
              gender: action.gender,
              panNumber: action.panNumber,
              aadhaarNumber: action.aadhaarNumber,
              dateOfBirth: action.dateOfBirth,
              email: action.email,
              aadhaarImage: data.aadhaarImage,
              panImage: data.panImage,
              userImage: data.userImage,
            }),
          ),
          catchError((error) => {
            console.error(error);
            return of(signupActions.FAILED({ error }));
          }),
        );
      }),
    ),
  );

  navigateToAddressDetails$ = createEffect(() =>
    this.actions.pipe(
      ofType(signupActions.setBasicDetailsSuccess),
      map(() => {
        this.router.navigate(['auth/signup/address']);
        return signupActions.navigateToAddressDetails();
      }),
    ),
  );

  navigateToCategoryDetails$ = createEffect(() =>
    this.actions.pipe(
      ofType(signupActions.setAddressDetails),
      map(() => {
        this.router.navigate(['auth/signup/services']);
        return signupActions.navigateToCategoryDetails();
      }),
    ),
  );

  // loadServiceCatalogue$ = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(serviceCatalogue.LOAD),
  //     withLatestFrom(this.store.select('signup', 'pendingUser')),
  //     mergeMap(([_, agentData]) => {
  //       if (agentData == null) {
  //         return of(
  //           signupActions.FAILED({
  //             error: 'User is not logged in',
  //           }),
  //         );
  //       }
  //       if (agentData.area == null) {
  //         return of(
  //           signupActions.FAILED({
  //             error: 'Area is not selected',
  //           }),
  //         );
  //       }
  //       return from(
  //         this.signupService.loadServiceCatalogue(
  //           agentData.area.serviceCatalogue,
  //         ),
  //       ).pipe(
  //         map((data) => {
  //           if (data.length > 0) {
  //             return serviceCatalogue.SUCCESS({ categories: data });
  //           } else {
  //             this.router.navigate(['auth/signup/address']);
  //             this.toastService.presentToast(
  //               'No categories found for your area, please select another area',
  //             );
  //             return serviceCatalogue.NO_CATEGORIES({ area: agentData.area! });
  //           }
  //         }),
  //         catchError((error) => {
  //           console.error(error);
  //           return of(serviceCatalogue.FAILED({ error }));
  //         }),
  //       );
  //     }),
  //   ),
  // );


  loadServiceCatalogue$ = createEffect(() =>
  this.actions.pipe(
    ofType(serviceCatalogue.LOAD),
    withLatestFrom(this.store.select('signup', 'pendingUser')),
    mergeMap(([action, agentData]) => {
      if (agentData == null) {
        return of(signupActions.FAILED({ error: 'User is not logged in' }));
      }
      return from(
        this.signupService.loadServiceCatalogue( agentData.state!.id, agentData.city!.id,),).pipe(
        map((areasDoc:any) => {
          console.log(areasDoc);
          let filteredAreas = areasDoc.filter((areaDoc:any) => areaDoc['active']);
          return filteredAreas.map((areaDoc:any) => {
            return {
              ...areaDoc,
            } as Area;
          });
        }),
        map((areaWiseCatlog) => serviceCatalogue.SUCCESS({ categories: areaWiseCatlog })),
        catchError((error) => of(serviceCatalogue.FAILED({ error }))),
      );
    }),
  ),
);

  finishSignupUp$ = createEffect(() =>
    this.actions.pipe(
      ofType(signupActions.completeSignup),
      withLatestFrom(this.store.select('app', 'currentUser')),
      withLatestFrom(this.store.select('signup', 'pendingUser')),
      mergeMap(([merged, pendingUser]) => {
        if (merged[1] == null) {
          return of(
            signupActions.FAILED({
              error: 'User is not logged in',
            }),
          );
        }
        return from(
          Promise.all([
            this.signupService.completeSignup(pendingUser, merged[1]),
            this.signupService.saveWorkingSlots(merged[1].uid),
          ])
        ).pipe(
          map((data) => {
            this.toastService.presentToast('Signup completed successfully');
            this.router.navigate(['main', 'home']);
            return signupActions.completeSignupSuccess();
          }),
          catchError((error) => {
            console.error(error);
            return of(signupActions.FAILED({ error }));
          }),
        );
      }),
    ),
  );
}
