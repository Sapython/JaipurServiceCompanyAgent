import { Timestamp } from '@angular/fire/firestore';

export interface AppNotification {
  title: string;
  icon: string;
  body: string;
  read: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
