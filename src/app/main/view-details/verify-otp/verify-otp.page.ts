import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginPageState } from 'src/app/auth/login/models/login.structure';
import { Booking } from 'src/app/shared/models/booking.structure';
import { ViewDetailsState } from '../models/viewDetails.structure';
import { ToastService } from 'src/app/shared/services/toast.service';
import { initial, otp } from '../actions';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
})
export class VerifyOtpPage {
  booking$: Observable<Booking | undefined> = this.store.select('viewDetails','booking',);
  otp: string = '';
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };
  public dateValidate: Boolean = true;
  constructor(
    private store: Store<{ viewDetails: ViewDetailsState }>,
    public router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
      this.store.dispatch(
        initial.loadBooking({
          id: params['bookingId'],
          customerId: params['customerId'],
        }),
      );
     this.store.select('viewDetails','booking',).subscribe((boooking:any) => {
      if(boooking?.timeSlot?.date.toDate().getTime() > new Date().getTime()){
        this.dateValidate = true;
      }
      else  this.dateValidate = false;

       })
    });
  }

  async login() {
    this.store.dispatch(otp.VALIDATE({ otp: this.otp }));
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
}
