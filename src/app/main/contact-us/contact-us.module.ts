import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactUsPage } from './contact-us.page';
import { ContactUsPageRoutingModule } from './contact-us-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { contactReducer } from './reducer/contact.reducer';
import { ContactEffects } from './effects/contact.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactUsPageRoutingModule,
    SharedModule,
    StoreModule.forFeature('contact', contactReducer),
    EffectsModule.forFeature([ContactEffects]),
  ],
  declarations: [ContactUsPage],
})
export class ContactUsPageModule {}
