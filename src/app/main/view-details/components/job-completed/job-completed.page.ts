import { Component, Input, OnInit } from '@angular/core';
import { BookingInvoiceService } from '../../services/invoice.service';
import { Booking } from 'src/app/shared/models/booking.structure';
import { rating } from '../../actions';
import { Store } from '@ngrx/store';
import { ViewDetailsState } from '../../models/viewDetails.structure';

@Component({
  selector: 'app-job-completed',
  templateUrl: './job-completed.page.html',
  styleUrls: ['./job-completed.page.scss'],
})
export class JobCompletedPage implements OnInit {
  @Input({ required: true }) booking: any | undefined;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 2;

  constructor( private bookingInvoiceService : BookingInvoiceService,private store: Store<{ viewDetails: ViewDetailsState }>) {}

  ngOnInit() {
    this.selectedValue = this.booking?.rating ? this.booking?.rating.rating : 0;
  }

  async countStar(star: number) {
    this.selectedValue = star;
    this.store.dispatch(rating.GiveRating({ rating: this.selectedValue }));
  }

  addClass(star: number) {
    let ab = '';
    for (let i = 0; i < star; i++) {
      ab = 'starId' + i;
      document.getElementById(ab)?.classList.add('selected');
    }
  }
  removeClass(star: number) {
    let ab = '';
    for (let i = star - 1; i >= this.selectedValue; i--) {
      ab = 'starId' + i;
      document.getElementById(ab)?.classList.remove('selected');
    }
  }
  downloadInvoice() {
    this.bookingInvoiceService.downloadInvoice(this.booking);
  }
}
