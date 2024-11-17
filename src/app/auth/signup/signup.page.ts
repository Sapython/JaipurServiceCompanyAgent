import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SignupState } from './models/signup.structure';
import { stateActions } from './actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(private store: Store<SignupState>) {}

  ngOnInit() {
    this.store.dispatch(stateActions.LOAD());
  }
}
