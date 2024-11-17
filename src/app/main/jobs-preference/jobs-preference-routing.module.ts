import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsPreferencePage } from './jobs-preference.page';

const routes: Routes = [
  {
    path: '',
    component: JobsPreferencePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsPreferencePageRoutingModule {}
