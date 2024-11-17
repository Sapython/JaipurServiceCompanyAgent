import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking.structure';
import { ViewDetailsState } from '../models/viewDetails.structure';
import { HomeState } from '../../home/model/home.structure';
import { completeJob } from '../actions';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  public paymentFlg: boolean = false;
  booking$: Observable<Booking | undefined> = this.store.select(
    'viewDetails',
    'booking',
  );
  constructor(public router: Router,private store: Store<{ viewDetails: ViewDetailsState ;home: HomeState}>) {}
  ngOnInit(): void {}

  paymentComplete() {
    // this.viewDetailService.stage='paymentCompleted';
  }
  paymentDone(event:any){
    this.paymentFlg =  event.detail.checked;
  }

  completeJob() {
    this.store.dispatch(completeJob.COMPLETE());
  }
}
