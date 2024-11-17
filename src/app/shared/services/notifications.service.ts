import { Injectable } from '@angular/core';
import { AppNotification } from '../models/notification.structure';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public notificationRegistrationToken: ReplaySubject<string> =
    new ReplaySubject<string>(1);
  public currentToken: string = '';
  constructor(
    private firestore: Firestore,
    private platform: Platform,
  ) {}

  async initNotifications() {
    if (this.platform.is('capacitor')) {
      let permissionRequested = await PushNotifications.checkPermissions();
      if (permissionRequested.receive !== 'granted') {
        permissionRequested = await PushNotifications.requestPermissions();
      }
      if (permissionRequested.receive !== 'granted') {
        throw new Error('Permission not granted for push notifications');
      }
      await PushNotifications.register();
      await this.addListeners();
      console.log('Notifications registered');
    }
  }

  async addListeners() {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);
      this.notificationRegistrationToken.next(token.value);
      this.currentToken = token.value;
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received: ', notification);
      },
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue,
        );
      },
    );
  }

  getNotifications(user: any): Observable<AppNotification[]> {
    if (!user) return Observable.create(null);
    // last 7 days date
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return collectionData(
      query(
        collection(this.firestore, 'agents', user.authInstance.uid, 'notifications'),
        where('createdAt', '>=', date),
      ),
      { idField: 'id' },
    ) as Observable<AppNotification[]>;
  }

  updateNotificationToken(user: User, token: string) {
    return updateDoc(doc(this.firestore, 'agents', user.uid), {
      notificationToken: token,
    });
  }
}
