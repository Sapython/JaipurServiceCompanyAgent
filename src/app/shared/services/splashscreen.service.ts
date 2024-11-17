import { Injectable } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SplashscreenService {
  constructor(private platform: Platform) {}

  hideSplashScreen() {
    if (this.platform.is('capacitor')) {
      console.log('Hiding splash screen');
      SplashScreen.hide();
    }
  }
}
