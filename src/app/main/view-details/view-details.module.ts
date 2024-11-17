import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewDetailsPageRoutingModule } from './view-details-routing.module';
import { ViewDetailsPage } from './view-details.page';
import { StoreModule } from '@ngrx/store';
import { viewDetailsReducer } from './reducers/view-details.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ViewDetailsEffects } from './effects/view-details.effect';
import { JobAcceptedPage } from './components/jobAccepted/jobAccepted.page';
import { JobStartedPage } from './components/jobStarted/jobStarted.page';
import { JobCompletedPage } from './components/job-completed/job-completed.page';
import { VerifySelfieComponent } from './components/verify-selfie/verify-selfie.component';
import { PictureManagerComponent } from './components/picture-manager/picture-manager.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { JobEndPage } from './components/job-end/job-end.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    ViewDetailsPageRoutingModule,
    SharedModule,
    StoreModule.forFeature('viewDetails', viewDetailsReducer),
    EffectsModule.forFeature([ViewDetailsEffects]),
  ],
  declarations: [
    ViewDetailsPage,
    JobAcceptedPage,
    JobStartedPage,
    JobCompletedPage,
    VerifySelfieComponent,
    PictureManagerComponent,
    InvoiceComponent,JobEndPage
  ],
})
export class ViewDetailsPageModule {}
