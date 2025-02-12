import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDetailsPage } from './view-details.page';

const routes: Routes = [
  {
    path: ':customerId/:bookingId/:stage',
    component: ViewDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewDetailsPageRoutingModule {}
