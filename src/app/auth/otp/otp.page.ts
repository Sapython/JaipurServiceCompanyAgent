import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginPageState } from '../login/models/login.structure';
import { Observable } from 'rxjs';
import { loginWithPhoneAction, loginWithPhone_VerifyOtpAction } from '../login/actions/login.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  otp: number = 0;
  phoneNumber: Observable<string> | undefined;
  constructor(
    private store: Store<{ login: LoginPageState }>,
    public router: Router,
  ) {}

  ngOnInit() {
    this.phoneNumber = this.store.select('login', 'phoneNumber');
  }

  login() {
    this.store.dispatch(
      loginWithPhone_VerifyOtpAction({ otp: this.otp.toString() })
    );
  }

  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };
  onOtpChange(otp: any) {
    this.otp = otp;
  }
  resendOTP() {
    this.phoneNumber?.subscribe((phoneNumber) => {      
      if (phoneNumber) {
        this.store.dispatch(
          loginWithPhoneAction({ phoneNumber: phoneNumber })
        );
        this.ngOtpInputRef.setValue('');
      }
    });
  }
}
