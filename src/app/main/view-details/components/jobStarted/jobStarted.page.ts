import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Booking } from 'src/app/shared/models/booking.structure';
import { PictureManagerComponent } from '../picture-manager/picture-manager.component';
import { Store } from '@ngrx/store';
import { ViewDetailsState } from '../../models/viewDetails.structure';
import { pictureAfterWork, pictureBeforeWork } from '../../actions';
import { ViewDetailsService } from '../../services/view-details.service';

@Component({
  selector: 'app-jobstarted',
  templateUrl: './jobStarted.page.html',
  styleUrls: ['./jobStarted.page.scss'],
})
export class JobStartedPage implements OnInit {
  @Input({ required: true }) booking: Booking | undefined;
  constructor(private modalController: ModalController,private store: Store<{ viewDetails: ViewDetailsState }>,private viewdetailsService :ViewDetailsService) {}

  ngOnInit(): void {}
  async managePictures(type: 'before' | 'after') {
    let modal = await this.modalController.create({
      component: PictureManagerComponent,
      componentProps: {
        booking: this.booking,
      },
      breakpoints: [0.25, 0.5, 0.75, 1],
      initialBreakpoint: 0.75,
    });
    modal.present();
  }

  saveProof() {
    this.viewdetailsService.skipButtonTrigger.next({skip : true});
    if (this.booking?.stage == 'workStarted') {
      this.store.dispatch(
        pictureBeforeWork.SAVE_IMAGES({ bookingId: this.booking.id! }),
      );
    } else {
      this.store.dispatch(
        pictureAfterWork.SAVE_IMAGES({ bookingId: this.booking?.id! }),
      );
    }
    this.modalController.dismiss();
  }
}
