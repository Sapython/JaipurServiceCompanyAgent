import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { BarChartMakeComponent } from './components/bar-chart-make/bar-chart-make.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { PendingJobPage } from './components/pending-job/pending-job.page';
import { BookingCardComponent } from './components/booking-card/booking-card.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { PendingJobSkeletonPage } from './components/pending-job-skeleton/pending-job-skeleton.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimerComponent } from './components/timer/timer.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FooterComponent,TimerComponent,
    BarChartMakeComponent,
    HeaderComponent,
    PendingJobPage,
    BookingCardComponent,
    FileInputComponent,
    PendingJobSkeletonPage,
    SidebarComponent,
  ],
  exports: [
    CommonModule,
    FooterComponent,
    BarChartMakeComponent,
    HeaderComponent,
    PendingJobPage,
    BookingCardComponent,
    FileInputComponent,
    PendingJobSkeletonPage,
    SidebarComponent,TimerComponent
  ],
})
export class SharedModule {}
