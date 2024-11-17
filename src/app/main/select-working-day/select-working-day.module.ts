import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectWorkingDayPageRoutingModule } from './select-working-day-routing.module';

import { SelectWorkingDayPage } from './select-working-day.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { SelectWorkingDayPageEffects } from './effects/select-working-day.effect';
import { StoreModule } from '@ngrx/store';
import { selectWorkingDayReducer } from './reducers/select-working-day.reducer';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectWorkingDayPageRoutingModule,
    SharedModule,
    MatDatepickerModule,
    EffectsModule.forFeature([SelectWorkingDayPageEffects]),
    StoreModule.forFeature('selectWorkingDay', selectWorkingDayReducer),
  ],
  declarations: [SelectWorkingDayPage],
})
export class SelectWorkingDayPageModule {}
