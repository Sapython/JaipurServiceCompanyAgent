import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobsDashboardPageRoutingModule } from './jobs-dashboard-routing.module';

import { JobsDashboardPage } from './jobs-dashboard.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { JobDashboardEffects } from './effects/jobs-dashboard.effects';
import { jobDashBoardReducer } from './reducer/jobs-dashboard.reducer';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MatButtonModule,
    IonicModule,
    JobsDashboardPageRoutingModule,
    StoreModule.forFeature('jobDashBoard', jobDashBoardReducer),
    EffectsModule.forFeature([JobDashboardEffects]),
  ],
  declarations: [JobsDashboardPage],
})
export class JobsDashboardPageModule {}
