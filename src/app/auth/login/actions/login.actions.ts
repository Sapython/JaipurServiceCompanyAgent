import { ConfirmationResult, RecaptchaVerifier } from '@angular/fire/auth';
import { createAction, createReducer, props } from '@ngrx/store';

export const loginWithPhoneAction = createAction(
  '[Login Page] Login With Phone',
  props<{ phoneNumber: string }>(),
);

export const loginWithPhone_OtpSentAction = createAction(
  '[Login Page] Login With Phone Verify OTP Sent',
  props<{ confirmationResult: ConfirmationResult; phoneNumber: string }>(),
);

export const loginWithPhone_VerifyOtpAction = createAction(
  '[Login Page] Login With Phone Verify OTP',
  props<{ otp: string }>(),
);

export const loginWithPhoneFailedAction = createAction(
  '[Login Page] Login With Phone Failed',
  props<{ errorMessage: string }>(),
);

export const loginWithPhoneSuccessAction = createAction(
  '[Login Page] Login With Phone Success',
);
