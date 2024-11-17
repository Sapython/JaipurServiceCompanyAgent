import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, from, map, catchError, of } from 'rxjs';
import {
  loginWithPhoneAction,
  loginWithPhoneSuccessAction,
  loginWithPhoneFailedAction,
  loginWithPhone_OtpSentAction,
  loginWithPhone_VerifyOtpAction,
} from '../actions/login.actions';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private loginService: LoginService,
    private router: Router,
  ) {}

  loginWithPhoneEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithPhoneAction),
      switchMap((action) => {
        return from(this.loginService.loginWithPhone(action.phoneNumber)).pipe(
          map((confirmationResult) => {
            console.log('OTP sent', confirmationResult);
            this.router.navigate(['auth/otp']);
            this.loginService.attachConfirmationResult(confirmationResult);
            return loginWithPhone_OtpSentAction({
              confirmationResult: confirmationResult,
              phoneNumber: action.phoneNumber,
            });
          }),
          catchError((error) => {
            return of(
              loginWithPhoneFailedAction({ errorMessage: error.message }),
            );
          }),
        );
      }),
    ),
  );

  verifyOtpEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithPhone_VerifyOtpAction),
      switchMap((action) => {
        return from(this.loginService.confirmOtp(action.otp)).pipe(
          map((userCredential) => {
            return loginWithPhoneSuccessAction();
          }),
          catchError((error) => {
            return of(
              loginWithPhoneFailedAction({ errorMessage: error.message }),
            );
          }),
        );
      }),
    ),
  );
}
