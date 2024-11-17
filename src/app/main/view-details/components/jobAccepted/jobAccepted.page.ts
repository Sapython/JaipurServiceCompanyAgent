import { Input, OnInit } from '@angular/core';
import { Component, ElementRef, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AnimationController,
  GestureController,
  IonCard,
} from '@ionic/angular';
import type { Animation, Gesture, GestureDetail } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Booking } from 'src/app/shared/models/booking.structure';
import { Store } from '@ngrx/store';
import { ViewDetailsState } from '../../models/viewDetails.structure';
import { startJob } from '../../actions';

@Component({
  selector: 'app-jobaccepted',
  templateUrl: './jobAccepted.page.html',
  styleUrls: ['./jobAccepted.page.scss'],
})
export class JobAcceptedPage {
  @Input({ required: true }) booking: Booking | undefined;

  @ViewChild(IonCard, { read: ElementRef })
  card: ElementRef<HTMLIonCardElement> | undefined;

  private animation: Animation | null = null;
  private gesture: Gesture | null = null;
  private started = false;
  private initialStep = 0;

  /**
   * The track is 344px wide.
   * The card is 100px wide.
   * We want 16px of margin on each end of the track.
   */
  private readonly MAX_TRANSLATE = 405 - 100 - 32;

  constructor(
    private animationCtrl: AnimationController,
    private gestureCtrl: GestureController,
    public router: Router,
    private store: Store<{ viewDetails: ViewDetailsState }>,
  ) {}

  private onMove(ev: GestureDetail) {
    if (!this.started) {
      this.animation?.progressStart();
      this.started = true;
    }

    this.animation?.progressStep(this.getStep(ev));
  }

  private onEnd(ev: GestureDetail) {
    if (!this.started) {
      return;
    }

    this.gesture?.enable(false);

    const step = this.getStep(ev);
    const shouldComplete = step > 0.5;

    this.animation?.progressEnd(shouldComplete ? 1 : 0, step).onFinish(() => {
      if (shouldComplete) {
        this.takePicture();
      }
      this.gesture?.enable(true);
    });

    this.initialStep = shouldComplete ? this.MAX_TRANSLATE : 0;
    this.started = false;
  }

  private clamp(min: number, n: number, max: number) {
    return Math.max(min, Math.min(n, max));
  }

  private getStep(ev: GestureDetail) {
    const delta = this.initialStep + ev.deltaX;
    return this.clamp(0, delta / this.MAX_TRANSLATE, 1);
  }

  ngAfterViewInit() {
    if (this.card?.nativeElement) {
      this.animation = this.animationCtrl
        .create()
        .addElement(this.card.nativeElement)
        .duration(1000)
        .fromTo(
          'transform',
          'translateX(0)',
          `translateX(${this.MAX_TRANSLATE}px)`,
        );

      const gesture = (this.gesture = this.gestureCtrl.create({
        el: this.card.nativeElement,
        threshold: 0,
        gestureName: 'card-drag',
        onMove: (ev) => this.onMove(ev),
        onEnd: (ev) => this.onEnd(ev),
      }));
      gesture.enable(true);
    }
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });
    // convert data url to blob
    if (image.dataUrl) {
      fetch(image.dataUrl).then(async (res) => {
        const blob = await res.blob();
        console.log(blob);
        this.store.dispatch(startJob.START({ image: blob }));
      });
    }
  };
}
