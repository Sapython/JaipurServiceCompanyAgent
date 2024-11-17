import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobsPreferencePageRoutingModule } from './jobs-preference-routing.module';

import { JobsPreferencePage } from './jobs-preference.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { PageEffects } from './effects/page.effect';
import { StoreModule } from '@ngrx/store';
import { jobsPreferencePageReducer } from './reducers/page.reducer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobsPreferencePageRoutingModule,
    SharedModule,
    EffectsModule.forFeature([PageEffects]),
    StoreModule.forFeature('jobsPreference', jobsPreferencePageReducer),
  ],
  declarations: [JobsPreferencePage],
})
export class JobsPreferencePageModule {}
