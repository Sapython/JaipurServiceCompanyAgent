import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private firestore: Firestore,    private toastService: ToastService,private router : Router, private menuController: MenuController
    ) {}

  loadStates() {
    return getDocs(collection(this.firestore, 'areas'));
  }

  loadCities(stateId: string) {
    return getDocs(collection(this.firestore, 'areas', stateId, 'cities'));
  }

  loadAreas(stateId: string, cityId: string) {
    return getDocs(
      collection(this.firestore, 'areas', stateId, 'cities', cityId, 'areas'),
    );
  }
  async updateAddress(
    address: {
      area: any;
      city: any;
      geographicalPoint: any;
      pincode: any;
      state:any;
      addressLine:any
    },
    uid: string,
  ) {
    let loader = await this.toastService.presentLoading('Updating Adrress');
    try {
      await updateDoc(doc(this.firestore, 'agents', uid), { address});
      await loader.dismiss();
      await this.toastService.presentToast('Address Updated');
      this.router.navigate(['main/home'])
      this.menuController.open();
    } catch (error) {
      await loader.dismiss();
      await this.toastService.presentToast(
        'Some error occurred while updating address',
      );
      throw error;
    }
  }
}
