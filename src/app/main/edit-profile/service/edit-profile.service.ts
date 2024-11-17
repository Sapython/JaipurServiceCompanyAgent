import { Injectable } from '@angular/core';
import { Firestore, Timestamp, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FileService } from 'src/app/shared/services/file.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  constructor(
    private firestore: Firestore,private router : Router,private menuController : MenuController,
    private fileService: FileService,
    private toastService: ToastService,
  ) {}

  async updateUser(
    user: {
      name: string;
      dateOfBirth: Timestamp;
      email: string;
      gender: string;
      photoUrl: string | File;
    },
    uid: string,
  ) {
    var photoUrl = user.photoUrl;
    let loader = await this.toastService.presentLoading('Updating Profile');
    try {
      if (user.photoUrl instanceof File) {
        photoUrl = await this.fileService.uploadFile(
          user.photoUrl,
          `agents/${uid}/profile`,
          'Profile Picture',
        );
      }
      await updateDoc(doc(this.firestore, 'agents', uid), {
        ...user,
        photoUrl,
      });
      await loader.dismiss();
      await this.toastService.presentToast('Profile Updated');
      this.router.navigate(['main/home'])
      this.menuController.open();
    } catch (error) {
      await loader.dismiss();
      await this.toastService.presentToast(
        'Some error occurred while updating profile',
      );
      throw error;
    }
  }
}
