import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import { AppState } from 'src/app/shared/models/app.structure';
import { LOAD_PROFILE } from './actions/edit-profile.actions';
import { Timestamp } from '@angular/fire/firestore';
import { EditProfileService } from './service/edit-profile.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  editProfileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    dateOfBirth: new FormControl<Date | undefined>(
      undefined,
      Validators.required,
    ),
    phoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    gender: new FormControl<'male' | 'female' | 'other' | undefined>(
      undefined,
      Validators.required,
    ),
  });
  photoUrl: string | File | undefined;
  userId: string | undefined;
  constructor(
    private store: Store<{ app: AppState }>,
    private editProfileService: EditProfileService,public router : Router,
    private toastService: ToastService,private menuController: MenuController,
  ) {}

  async ngOnInit() {
    this.store.select('app', 'agentData').subscribe((agentData) => {
      this.editProfileForm.patchValue({
        ...agentData,
        dateOfBirth: agentData?.dateOfBirth.toDate(),
      });
      this.userId = agentData?.uid;
      this.photoUrl =
        agentData?.photoUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${this.userId}`;
    });
  }

  updateUser() {
    if (this.editProfileForm.valid && this.photoUrl) {
      this.editProfileService.updateUser(
        {
          photoUrl: this.photoUrl!,
          dateOfBirth: Timestamp.fromDate(
            this.editProfileForm.value.dateOfBirth!,
          ),
          email: this.editProfileForm.value.email!,
          gender: this.editProfileForm.value.gender!,
          name: this.editProfileForm.value.name!,
        },
        this.userId!,
      );
    } else {
      this.toastService.presentToast('Please fill all the fields');
    }
  }

  setPhoto(event: any) {
    this.photoUrl = event.target.files[0];
    this.updateUser();
  }
  close(){
    this.router.navigate(['main/home'])
    this.menuController.open();
  }
}
