import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvoicePage } from './invoice.page';
import { InvoicePageRoutingModule } from './invoice.routing.module';
import { EndJobSliderPage } from './end-job-slider/end-job-slider.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    InvoicePageRoutingModule,
  ],
  declarations: [InvoicePage, EndJobSliderPage],
})
export class invoicePageModule {}
