import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';
import { ViewDetailsState } from '../../models/viewDetails.structure';
import { Observable, Subject } from 'rxjs';
import { pictureAfterWork, pictureBeforeWork } from '../../actions';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ModalController, ToastController } from '@ionic/angular';
import { ViewDetailsService } from '../../services/view-details.service';

@Component({
  selector: 'app-picture-manager',
  templateUrl: './picture-manager.component.html',
  styleUrls: ['./picture-manager.component.scss'],
})
export class PictureManagerComponent implements OnInit {
  @Input({ required: true }) booking!: Booking;
  beforeImages: Observable<string[]> = this.store.select(
    'viewDetails',
    'pictureBeforeWork',
  );
  afterImages: Observable<string[]> = this.store.select(
    'viewDetails',
    'pictureAfterWork',
  );
  takingPicture: Subject<boolean> = new Subject();
  constructor(
    private store: Store<{ viewDetails: ViewDetailsState }>,
    private toastController: ToastController,
    private modalController: ModalController,private viewdetailsService :ViewDetailsService
  ) {}

  ngOnInit() {}

  async capture(type: 'after' | 'before') {
    this.takingPicture.next(true);
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });
    if (image.dataUrl) {
      if (type === 'after') {
        this.store.dispatch(
          pictureAfterWork.ADD_IMAGE({
            image: image.dataUrl,
            bookingId: this.booking.id!,
          }),
        );
      } else {
        this.store.dispatch(
          pictureBeforeWork.ADD_IMAGE({
            image: image.dataUrl,
            bookingId: this.booking.id!,
          }),
        );
      }
    } else {
      this.toastController.create({ message: 'No image captured' });
    }
    this.takingPicture.next(false);
  }

  remove(index: number, type: 'after' | 'before') {
    if (type === 'after') {
      this.store.dispatch(pictureAfterWork.REMOVE_IMAGE({ index }));
    } else {
      this.store.dispatch(pictureBeforeWork.REMOVE_IMAGE({ index }));
    }
  }

  saveProof() {
    this.viewdetailsService.skipButtonTrigger.next({skip : false});
    if (this.booking.stage == 'workStarted') {
      this.store.dispatch(
        pictureBeforeWork.SAVE_IMAGES({ bookingId: this.booking.id! }),
      );
    } else {
      this.store.dispatch(
        pictureAfterWork.SAVE_IMAGES({ bookingId: this.booking.id! }),
      );
    }
    this.modalController.dismiss();
  }
}
