import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { AddressComponent } from './components/address/address.component';
import { ServicesComponent } from './components/services/services.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { StoreModule } from '@ngrx/store';
import { signupReducer } from './reducers/signup.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SignupEffects } from './effects/signup.effect';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
import { AddressEffects } from './effects/address.effects';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    SignupPageRoutingModule,
    GoogleMapsModule,
    StoreModule.forFeature('signup', signupReducer),
    EffectsModule.forFeature([SignupEffects, AddressEffects]),
    MatDatepickerModule,
  ],
  declarations: [
    SignupPage,
    AddressComponent,
    BasicDetailsComponent,
    ServicesComponent,
  ],
})
export class SignupPageModule {}
