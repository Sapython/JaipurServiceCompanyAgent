import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('./notification/notification.module').then(
            (m) => m.NotificationPageModule,
          ),
      },
      {
        path: 'money',
        loadChildren: () =>
          import('./money/money.module').then((m) => m.MoneyPageModule),
      },
      {
        path: 'jobs-dashboard',
        loadChildren: () =>
          import('./jobs-dashboard/jobs-dashboard.module').then(
            (m) => m.JobsDashboardPageModule,
          ),
      },
      {
        path: 'view-details',
        loadChildren: () =>
          import('./view-details/view-details.module').then(
            (m) => m.ViewDetailsPageModule,
          ),
      },
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('./edit-profile/edit-profile.module').then(
            (m) => m.EditProfilePageModule,
          ),
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contact-us/contact-us.module').then(
            (m) => m.ContactUsPageModule,
          ),
      },
      {
        path: 'about-jc',
        loadChildren: () =>
          import('./about-jc/about-jc.module').then((m) => m.AboutJCPageModule),
      },
      {
        path: 'verify-otp',
        loadChildren: () =>
          import('./view-details/verify-otp/verify-otp.module').then(
            (m) => m.VerifyOtpPageModule,
          ),
      },
      {
        path: 'select-working-day',
        loadChildren: () =>
          import('./select-working-day/select-working-day.module').then(
            (m) => m.SelectWorkingDayPageModule,
          ),
      },
      {
        path: 'jobs-preference',
        loadChildren: () =>
          import('./jobs-preference/jobs-preference.module').then(
            (m) => m.JobsPreferencePageModule,
          ),
      },
      {
        path: 'area-jobs',
        loadChildren: () =>
          import('./jobs-preference/jobs-preference.module').then(
            (m) => m.JobsPreferencePageModule,
          ),
      },
      {
        path: 'identity-proof',
        loadChildren: () =>
          import('./identity-proof/identity-proof.module').then(
            (m) => m.IdentityProofPageModule,
          ),
      },
      {
        path: 'edit-address',
        loadChildren: () =>
          import('./edit-address/edit-address.module').then(
            (m) => m.EditAddressPageModule,
          ),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./view-details/invoice/invoice.module').then(
            (m) => m.invoicePageModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
