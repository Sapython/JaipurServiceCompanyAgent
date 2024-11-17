import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking.structure';
import { ViewDetailsState } from './models/viewDetails.structure';
import { initial } from './actions';
import { calcDistance } from 'src/distanceCalculator';
import { AcceptancePendingJob, HomeState } from '../home/model/home.structure';
import { acceptJob, rejectJob } from '../home/actions';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.page.html',
  styleUrls: ['./view-details.page.scss'],
})
export class ViewDetailsPage {
  booking$: Observable<Booking | undefined> = this.store.select(
    'viewDetails',
    'booking',
  );
  acceptancePendingJobs$: Observable<AcceptancePendingJob[]> = this.store.select('home', 'acceptancePendingJobs');
  acceptedJobs$: Observable<Booking[]> = this.store.select('home', 'acceptedJobs');
  inProgressStages: string[] = [
    'acceptancePending',
    'jobAccepted',
    'jobStarted',
    'otpVerificationPending',
    'workStarted',
    'inProgress',
    'workCompleted',
    'completed',
    'expired',
    'discarded',
  ];
  completedStages: string[] = [
    'paymentPending',
    'paymentCompleted',
  ];
  jobsStage = {
    acceptancePending: 'Acceptance Pending',
    jobAccepted: 'Jobs Accepted',
    jobStarted: 'Job Started',
    otpVerificationPending: 'Otp Verfification Pending',
    workStarted: 'Work Started',
    inProgress: 'In Progress',
    workCompleted: 'Work Completed',
    expired: 'Expired',
    discarded: 'Discarded',
    paymentPending: 'Payment Pending',
    paymentCompleted: 'Payment Completed',
    completed: 'Completed',
  };
  distance: number = 0;
  headerName: string = 'Job Details';
  constructor(
    private activatedRoute: ActivatedRoute,private modalCtrl: ModalController,
    private store: Store<{ viewDetails: ViewDetailsState ;home: HomeState}>,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      this.store.dispatch(
        initial.loadBooking({
          id: params['bookingId'],
          customerId: params['customerId'],
        }),
      );
    });
    navigator.geolocation.getCurrentPosition(async (position) => {
      let booking = await firstValueFrom(this.booking$);
      if (booking) {
        //TODO: waiting for customer app to add additional detail of coordinates in booking
        this.distance = calcDistance(
          position.coords.latitude,
          position.coords.longitude,
          Number(booking.address!.latitude),
          Number(booking.address!.longitude),
        );
      }
    });
    this.booking$.subscribe((booking :any)=> { this.headerName = this.completedStages.includes(booking.stage) ? 'Invoice' : booking.stage =='completed' ? 'Job Completed': 'Job Details' }  )
  }

  acceptJob(id:any) {
    this.acceptancePendingJobs$.subscribe((pendingBookings:any) =>{
      pendingBookings?.forEach((job:AcceptancePendingJob) => {
        if(job.bookingID == id){
          this.store.dispatch(acceptJob.ACCEPT({ job }))
        }
      });
     })
  }

  rejectJob(id: any) {
    this.acceptancePendingJobs$.subscribe((pendingBookings:any) =>{
      pendingBookings?.forEach((job:AcceptancePendingJob) => {
        if(job.bookingID == id){
          this.store.dispatch(rejectJob.REJECT({ job }));
          this.modalCtrl.dismiss();
        }
      });
     })
  }
}
