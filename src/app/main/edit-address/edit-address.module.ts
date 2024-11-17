import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAddressPageRoutingModule } from './edit-address-routing.module';

import { EditAddressPage } from './edit-address.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { editAddressReducer } from './reducers/edit-address.reducer';
import { EditAddressEffects } from './effects/edit-address.effect';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAddressPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    GoogleMapsModule,
    EffectsModule.forFeature([EditAddressEffects]),
    StoreModule.forFeature('editAddress', editAddressReducer),
  ],
  declarations: [EditAddressPage],
})
export class EditAddressPageModule {}
