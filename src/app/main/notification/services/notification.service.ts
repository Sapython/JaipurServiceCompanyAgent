import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private firestore: Firestore) {}

  async loadNotification(agentId: string) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let todayNotifications = await getDocs(
      query(
        collection(this.firestore, 'agents', agentId, 'notifications'),
        //where('read', '==', false),
        where('createdAt', '>=', currentDate),
        where(
          'createdAt',
          '<',
          new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
        )
      )
    );
    let olderNotifications = await getDocs(
      query(
        collection(this.firestore, 'agents', agentId, 'notifications'),
        //where('read', '==', false),
        where('createdAt', '<', currentDate)
      )
    );
    return {
      todayNotifications: todayNotifications.docs.map((notification) => {
        return { id: notification.id, ...notification.data() } as any;
      }),
      olderNotifications: olderNotifications.docs.map((notification) => {
        return { id: notification.id, ...notification.data() } as any;
      }),
    };
  }

  async markAllNotificationsAsRead(agentId: string): Promise<void> {
    const notificationsQuery = query(
      collection(this.firestore, 'agents', agentId, 'notifications')
    );
    const querySnapshot = await getDocs(notificationsQuery);
    const batch = writeBatch(this.firestore);
    querySnapshot.forEach((doc1: any) => {
      const notificationRef = doc(
        this.firestore,
        'agents',
        agentId,
        'notifications',
        doc1.id
      );
      batch.update(notificationRef, { read: true });
    });
    await batch.commit();
  }

  deleteNotification(agentId: string, notificationId: string): Promise<void> {
    return deleteDoc(
      doc(this.firestore, 'agents', agentId, 'notifications', notificationId)
    );
  }
}
