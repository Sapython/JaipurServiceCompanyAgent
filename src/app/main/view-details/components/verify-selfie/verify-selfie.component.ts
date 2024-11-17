import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-verify-selfie',
  templateUrl: './verify-selfie.component.html',
  styleUrls: ['./verify-selfie.component.scss'],
})
export class VerifySelfieComponent implements OnInit {
  @Input({ required: true }) verified: Observable<boolean> | undefined;
  constructor(private modalController: ModalController) {
    this.verified?.subscribe((verified) => {
      if (verified) {
        setTimeout(() => {
          this.modalController.dismiss();
        }, 1500);
      }
    });
  }

  ngOnInit() {}
}
