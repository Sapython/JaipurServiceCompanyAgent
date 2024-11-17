import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { VerifyOtpPage } from './verify-otp.page';
import { VerifyOtpRoutingModule } from './verify-otp-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { OtpPageRoutingModule } from 'src/app/auth/otp/otp-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { viewDetailsReducer } from '../reducers/view-details.reducer';
import { ViewDetailsEffects } from '../effects/view-details.effect';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    VerifyOtpRoutingModule,
    OtpPageRoutingModule,
    NgOtpInputModule,
    StoreModule.forFeature('viewDetails', viewDetailsReducer),
    EffectsModule.forFeature([ViewDetailsEffects]),
  ],
  declarations: [VerifyOtpPage],
})
export class VerifyOtpPageModule {}
