import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SignupState } from '../../models/signup.structure';
import { setBasicDetails } from '../../actions/signup.actions';
import { AppState } from 'src/app/shared/models/app.structure';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
})
export class BasicDetailsComponent {
  basicDetailForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    panNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(RegExp('[A-Z]{5}[0-9]{4}[A-Z]{1}')),
    ]),
    aadhaarNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(RegExp('[0-9]{12}')),
    ]),
  });
  aadhaarImage: File | undefined;
  panImage: File | undefined;
  userImage: File | undefined;
  constructor(
    private store: Store<{ signup: SignupState; app: AppState }>,
    private toastService: ToastService,
  ) {}

  async submit() {
    if (
      this.basicDetailForm.valid &&
      this.aadhaarImage &&
      this.panImage &&
      this.userImage
    ) {
      this.store.dispatch(
        setBasicDetails({
          aadhaarImage: this.aadhaarImage,
          panImage: this.panImage,
          userImage: this.userImage,
          ...this.basicDetailForm.value,
          dateOfBirth: Timestamp.fromDate(
            new Date(this.basicDetailForm.value.dateOfBirth),
          ),
        }),
      );
    } else {
      // check in which field error is there then show toast
      this.handleError();
    }
  }

  handleError() {
    if (this.basicDetailForm.invalid) {
      this.basicDetailForm.markAllAsTouched();
    } else if (!this.aadhaarImage) {
      this.toastService.presentToast('Please upload valid aadhaar image');
    } else if (!this.panImage) {
      this.toastService.presentToast('Please upload valid pan image');
    } else if (!this.userImage) {
      this.toastService.presentToast('Please upload valid user image');
    } else if (this.basicDetailForm.controls['name'].invalid) {
      this.toastService.presentToast('Please enter valid name');
    } else if (this.basicDetailForm.controls['gender'].invalid) {
      this.toastService.presentToast('Please enter select gender');
    } else if (this.basicDetailForm.controls['panNumber'].invalid) {
      this.toastService.presentToast('Please enter valid pan number');
    } else if (this.basicDetailForm.controls['aadhaarNumber'].invalid) {
      this.toastService.presentToast('Please enter valid aadhaar number');
    } else if (this.basicDetailForm.controls['dateOfBirth'].invalid) {
      this.toastService.presentToast('Please enter valid date of birth');
    } else if (this.basicDetailForm.controls['email'].invalid) {
      this.toastService.presentToast('Please enter valid email');
    } else {
      this.toastService.presentToast('Form is invalid');
    }
  }
}
