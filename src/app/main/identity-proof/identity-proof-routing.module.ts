import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentityProofPage } from './identity-proof.page';

const routes: Routes = [
  {
    path: '',
    component: IdentityProofPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityProofPageRoutingModule {}
