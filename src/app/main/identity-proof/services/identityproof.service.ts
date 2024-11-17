import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FileService } from 'src/app/shared/services/file.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityproofService {
  constructor(
    private fileService: FileService,
    private toastService: ToastService,
    private firestore: Firestore,private router :Router, private menuController: MenuController,
  ) {}

  async updateKycDetails(
    userId: string,
    aadhaarNumber: string,
    panNumber: string,
    aadhaarImage?: File,
    panImage?: File,
  ) {
    let loader = await this.toastService.presentLoading(
      'Uploading KYC Details',
    );
    try {
      let kycDetails: any = {
        aadhaarNumber,
        panNumber,
      };
      if (aadhaarImage) {
        let imageAadhaarUrl = await this.fileService.uploadFile(
          aadhaarImage,
          `agents/${userId}/aadhaar`,
          'Aadhaar',
        );
        kycDetails['aadhaarImageUrl'] = imageAadhaarUrl;
      }
      if (panImage) {
        let imagePanUrl = await this.fileService.uploadFile(
          panImage,
          `agents/${userId}/pan`,
          'Pan',
        );
        kycDetails['panImageUrl'] = imagePanUrl;
      }
      await setDoc(
        doc(this.firestore, 'agents', userId),
        {
          userProofDocument: kycDetails,
        },
        { merge: true },
      );
      if(panImage && aadhaarImage){
        this.router.navigate(['main/home'])
        this.menuController.open();
      }
      loader.dismiss();
    } catch (error) {
      loader.dismiss();
      this.toastService.presentToast('Error uploading KYC Details');
      throw error;
    }
  }
}
