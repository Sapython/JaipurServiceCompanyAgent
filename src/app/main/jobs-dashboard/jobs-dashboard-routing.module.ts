import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsDashboardPage } from './jobs-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: JobsDashboardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsDashboardPageRoutingModule {}
