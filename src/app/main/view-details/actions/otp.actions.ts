import { createAction, props } from '@ngrx/store';

export const VALIDATE = createAction(
  '[ViewDetails] OTP Validation',
  props<{ otp: string }>(),
);

export const VALIDATION_FAILED = createAction(
  '[ViewDetails] OTP Validation Failed',
  props<{ error: any }>(),
);

export const VALIDATION_SUCCESSFUL = createAction(
  '[ViewDetails] OTP Validation Successful',
);
