import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AcceptancePendingJob } from 'src/app/main/home/model/home.structure';
import { calcDistance } from 'src/distanceCalculator';

@Component({
  selector: 'app-pending-job',
  templateUrl: './pending-job.page.html',
  styleUrls: ['./pending-job.page.scss'],
})
export class PendingJobPage {
  @Input({ required: true }) job!: AcceptancePendingJob;
  @Output() accept: EventEmitter<void> = new EventEmitter<void>();
  @Output() reject: EventEmitter<void> = new EventEmitter<void>();
  distance: number = 0;
  constructor(private modalCtrl: ModalController,) {
    navigator.geolocation.getCurrentPosition((position) => {
      //TODO: waiting for customer app to add additional detail of coordinates in booking
      this.distance = calcDistance(
        position.coords.latitude,
        position.coords.longitude,
        Number(this.job.bookingData.address!.latitude),
        Number(this.job.bookingData.address!.longitude),
      );
    });
  }
  rejectJob(){
   this.reject.emit();
   this.modalCtrl.dismiss();
  }
}
