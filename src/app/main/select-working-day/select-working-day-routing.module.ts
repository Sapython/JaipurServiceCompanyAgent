import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectWorkingDayPage } from './select-working-day.page';

const routes: Routes = [
  {
    path: '',
    component: SelectWorkingDayPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectWorkingDayPageRoutingModule {}
