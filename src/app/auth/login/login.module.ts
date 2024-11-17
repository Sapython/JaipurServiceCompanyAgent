import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { EffectsModule } from '@ngrx/effects';
import { loginPageReducer } from './reducers/login.reducer';
import { StoreModule } from '@ngrx/store';
import { LoginEffects } from './effects/login.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    StoreModule.forFeature('login', loginPageReducer),
    EffectsModule.forFeature([LoginEffects]),
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
