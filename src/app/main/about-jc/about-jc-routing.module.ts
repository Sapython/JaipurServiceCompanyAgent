import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutJCPage } from './about-jc.page';

const routes: Routes = [
  {
    path: '',
    component: AboutJCPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutJCPageRoutingModule {}
