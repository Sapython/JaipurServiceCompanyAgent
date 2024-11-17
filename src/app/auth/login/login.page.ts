import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/shared/models/app.structure';
import {
  loginWithPhoneAction,
  loginWithPhoneFailedAction,
} from './actions/login.actions';
import { LoginPageState } from './models/login.structure';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Auth, RecaptchaVerifier } from '@angular/fire/auth';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  stage:
    | Observable<
        | 'checkingAuth'
        | 'loggedIn'
        | 'loginRequired'
        | 'error'
        | 'loggedOut'
        | 'signupRequired'
      >
    | undefined;
  inputError: Observable<boolean> | undefined;
  phoneLoginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
    ]),
  });
  constructor(
    private store: Store<{ app: AppState; login: LoginPageState }>,
    private auth: Auth,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loginService.recaptchaVerifier = new RecaptchaVerifier(
        this.auth,
        'recaptcha-container',
        { size: 'invisible' },
      );
    }, 1000);
    this.stage = this.store.select('app', 'appStage');
    this.inputError = this.store.select('login', 'errorOccurred');
  }

  login() {
    if (this.phoneLoginForm.valid && this.loginService.recaptchaVerifier) {
      console.log('Login with phone', this.phoneLoginForm.value.phoneNumber);
      this.store.dispatch(
        loginWithPhoneAction({
          phoneNumber: '+91' + this.phoneLoginForm.value.phoneNumber,
        }),
      );
    } else {
      this.store.dispatch(
        loginWithPhoneFailedAction({
          errorMessage: 'Please enter a valid phone number',
        }),
      );
    }
  }
}
