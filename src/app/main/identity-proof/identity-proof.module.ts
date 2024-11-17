import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdentityProofPageRoutingModule } from './identity-proof-routing.module';

import { IdentityProofPage } from './identity-proof.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    IdentityProofPageRoutingModule,
  ],
  declarations: [IdentityProofPage],
})
export class IdentityProofPageModule {}
