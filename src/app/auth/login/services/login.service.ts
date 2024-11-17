import { Injectable } from '@angular/core';
import {
  Auth,
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '@angular/fire/auth';
import { ToastService } from 'src/app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  recaptchaVerifier: RecaptchaVerifier | undefined;
  confirmationResult: ConfirmationResult | undefined;
  constructor(
    private auth: Auth,
    private toastService: ToastService,
  ) {}

  async loginWithPhone(phoneNumber: string) {
    let loader = await this.toastService.presentLoading('Sending OTP...');
    try {
      let ref = await signInWithPhoneNumber(
        this.auth,
        phoneNumber,
        this.recaptchaVerifier!,
      );
      loader.dismiss();
      return ref;
    } catch (error) {
      console.error(error);
      loader.dismiss();
      throw error;
    }
  }

  attachConfirmationResult(confirmationResult: any) {
    this.confirmationResult = confirmationResult;
  }

  async confirmOtp(otp: string) {
    let loader = await this.toastService.presentLoading('Verifying OTP...');
    try {
      let ref = await this.confirmationResult!.confirm(otp);
      loader.dismiss();
      return ref;
    } catch (error: any) {
      console.error(error.code);
      this.toastService.presentToast(
        this.toastService.getErrorMessage(error.code),
        6000,
      );
      loader.dismiss();
      throw error;
    }
  }
}
