import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';
import { AddressComponent } from './components/address/address.component';
import { ServicesComponent } from './components/services/services.component';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';

const routes: Routes = [
  {
    path: '',
    component: SignupPage,
    children: [
      {
        path: '',
        redirectTo: 'basic-details',
        pathMatch: 'full',
      },
      {
        path: 'basic-details',
        component: BasicDetailsComponent,
      },
      {
        path: 'address',
        component: AddressComponent,
      },
      {
        path: 'services',
        component: ServicesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {}
