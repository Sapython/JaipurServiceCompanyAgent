import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AboutJCPage } from './about-jc.page';
import { AboutJCPageRoutingModule } from './about-jc-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutJCPageRoutingModule,
    SharedModule,
  ],
  declarations: [AboutJCPage],
})
export class AboutJCPageModule {}
