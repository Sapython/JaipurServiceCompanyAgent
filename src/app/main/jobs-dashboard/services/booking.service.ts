import { Injectable } from '@angular/core';
import {
  Firestore,
  getDocs,
  collectionGroup,
  where,
  query,
  QueryDocumentSnapshot,
  orderBy,
  limit,
  startAfter,
} from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking.structure';
import { DateRange } from '../reducer/jobs-dashboard.reducer';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  dataProvider: any;
  bookings: Booking[] = [];
  bookingsSubject: Subject<Booking[]> = new Subject<Booking[]>();
  lastPendingDocument: QueryDocumentSnapshot | null = null;
  lastInProgressDocument: QueryDocumentSnapshot | null = null;
  lastCompletedDocument: QueryDocumentSnapshot | null = null;
  lastCancelledDocument: QueryDocumentSnapshot | null = null;

  constructor(private firestore: Firestore) {}

  ///--- Get Pending Jobs ----
  async getPendingJobs(agentId: string) {
    if (this.lastPendingDocument) {
      var data = await getDocs(
        query(
          collectionGroup(this.firestore, 'bookings'),
          where('assignedAgent', '==', agentId),
          where('stage', 'in', ['jobAccepted']),
          orderBy('createdAt'),
          limit(5),
          startAfter(this.lastPendingDocument),
        ),
      );
    } else {
      var data = await getDocs(
        query(
          collectionGroup(this.firestore, 'bookings'),
          where('assignedAgent', '==', agentId),
          where('stage', 'in', ['jobAccepted']),
          orderBy('createdAt'),
          limit(5),
        ),
      );
    }
    if (data.docs.length) {
      this.lastPendingDocument = data.docs[data.docs.length - 1];
      return data.docs.map((booking) => {
        return { id: booking.id, ...booking.data() } as Booking;
      });
    } else return [];
  }

  //Get Inprogress Jobs
  async getInProgressJobs(agentId: string) {
    if (this.lastInProgressDocument) {
      var data = await getDocs(
        query(
          collectionGroup(this.firestore, 'bookings'),
          where('assignedAgent', '==', agentId),
          where('stage', 'in', [
            'jobStarted',
            'otpVerificationPending',
            'inProgress',
            'workStarted',
            'workCompleted',
            'paymentPending',
            'paymentCompleted',
          ]),
          orderBy('createdAt'),
          limit(5),
          startAfter(this.lastInProgressDocument),
        ),
      );
    } else {
      var data = await getDocs(
        query(
          collectionGroup(this.firestore, 'bookings'),
          where('assignedAgent', '==', agentId),
          where('stage', 'in', [
            'jobStarted',
            'otpVerificationPending',
            'inProgress',
            'workStarted',
            'workCompleted',
            'paymentPending',
            'paymentCompleted',
          ]),
          orderBy('createdAt'),
          limit(5),
        ),
      );
    }
    if (data.docs.length) {
      this.lastInProgressDocument = data.docs[data.docs.length - 1];
      return data.docs.map((booking) => {
        return { id: booking.id, ...booking.data() } as Booking;
      });
    } else return [];
  }

  //Get Completed Jobs

  async getCompletedJobs(agentId: string, dateRange: any) {
    var data = await getDocs(
      query(
        collectionGroup(this.firestore, 'bookings'),
        where('assignedAgent', '==', agentId),
        where('stage', '==', 'completed'),
        where('createdAt', '>=', dateRange.start),
        where('createdAt', '<=', dateRange.end),
        orderBy('createdAt'),
      ),
    );
    return data.docs.map((booking) => {
      return { id: booking.id, ...booking.data() } as Booking;
    });
  }

  // Get Cancelled Jobs
  async getCancelledJobs(agentId: string, dateRange: DateRange) {
    var data = await getDocs(
      query(
        collectionGroup(this.firestore, 'bookings'),
        where('assignedAgent', '==', agentId),
        where('stage', 'in', ['expired', 'discarded']),
        where('createdAt', '>=', dateRange.start),
        where('createdAt', '<=', dateRange.end),
        orderBy('createdAt'),
      ),
    );
    return data.docs.map((booking) => {
      return { id: booking.id, ...booking.data() } as Booking;
    });
  }
}
