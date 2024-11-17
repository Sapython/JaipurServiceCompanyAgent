import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionGroup,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Booking } from 'src/app/shared/models/booking.structure';

@Injectable({
  providedIn: 'root',
})
export class MoneyService {
  constructor(private firestore: Firestore) {}

  async loadCompletedJobs(agentId: string, date: Date) {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let data = await getDocs(
      query(
        collectionGroup(this.firestore, 'bookings'),
        where('assignedAgent', '==', agentId),
        where('createdAt', '>=', firstDay),
        where('createdAt', '<=', lastDay),
        where('stage', '==', 'completed'),
      ),
    );
    return data.docs.map((booking) => {
      return { id: booking.id, ...booking.data() } as Booking;
    });
  }
}
