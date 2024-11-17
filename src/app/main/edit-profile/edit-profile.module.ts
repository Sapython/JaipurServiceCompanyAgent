import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EditProfilePage } from './edit-profile.page';
import { EditProfileRoutingModule } from './edit-profile-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfileRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
  ],
  declarations: [EditProfilePage],
})
export class EditProfilePageModule {}
