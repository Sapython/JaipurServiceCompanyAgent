import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { AcceptancePendingJob, Assignment } from '../model/home.structure';
import { Booking } from 'src/app/shared/models/booking.structure';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Slot } from '../../select-working-day/models/slot.structure';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private firestore: Firestore) {}

  // ...

  loadAcceptancePendingJobs(agentId: string): Observable<AcceptancePendingJob[]> {
    return collectionData(
      query(
        collectionGroup(this.firestore, 'assignments'),
        where('agentId', '==', agentId),
        where('actionPerformed', '==', false),
      ), {idField:"id"}
    ).pipe(
      mergeMap(async (docs) => {
        let assignments = docs as Assignment[];
        if (assignments.length === 0) {
          return [];
        }
        if (assignments.length <= 10) {
          // map all the ids and get the bookings
          let ids = assignments.map((doc) => doc.bookingID);
          console.log('ids', ids);
          let snapshot = await getDocs(
            query(
              collectionGroup(this.firestore, 'bookings'),
              where('id', 'in', ids),
            )
          )
          const bookings = snapshot.docs.map((doc) => {return {id:doc.id,...doc.data()}});
            // merge the bookings with the assignments
            return assignments.map((doc) => {
              const booking = bookings.find((booking) => booking.id === doc.bookingID);
              const assignment_Pending = {
                ...doc,
                bookingData: booking,
              } as AcceptancePendingJob;
              return assignment_Pending;
            });
        } else {
          // fetch the bookings sequentially and merge them with the assignments
          const assignments: AcceptancePendingJob[] = [];
          return new Promise<AcceptancePendingJob[]>((resolve, reject) => {
            let i = 0;
            const fetchBooking = () => {
              if (i < assignments.length) {
                const assignment = {
                  ...assignments[i],
                } as AcceptancePendingJob;
                getDocs(
                  query(
                    collectionGroup(this.firestore, 'bookings'),
                    where('id', '==', assignment.bookingID),orderBy('createdAt'),
                  )
                ).then((snapshot) => {
                  const booking = snapshot.docs.find(doc => doc.id === assignment.bookingID);
                  assignment.bookingData = {...booking?.data(), id: booking?.id} as Booking;
                  assignments.push(assignment);
                  i++;
                  fetchBooking();
                }).catch((error) => {
                  reject(error);
                });
              } else {
                resolve(assignments);
              }
            };
            fetchBooking();
          });
        }
      })
    );
  }

  loadAcceptedJobs(agentId: string) {
    return collectionData(
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
          'completed','jobAccepted'
        ]),
        orderBy('acceptedAt','desc'),
      ), {idField:"id"}
    );  
  }

  async getWorkingSlotsData(agentId: string) {
    let workingDayDetails:any = {}
    let currentDate = new Date().toISOString().split('T')[0];
    let nextDate = new Date(+new Date().setHours(0, 0, 0,0)+ 86400000).toLocaleDateString('fr-CA')
    let currentDateSlot = (
      await getDoc(doc(this.firestore, 'agents', agentId, 'slots', currentDate!))
    ).data() as Slot;
    let nextDateSlot = (
      await getDoc(doc(this.firestore, 'agents', agentId, 'slots', nextDate!))
    ).data() as Slot;

    if (!currentDateSlot){
      workingDayDetails['currentDaySlotText'] = 'No slot available'
    }
    else if(currentDateSlot && currentDateSlot.working){
      workingDayDetails['currentDaySlotText'] = 'working'
    }
    else if(currentDateSlot && !currentDateSlot.working){
      workingDayDetails['currentDaySlotText'] = 'Not working'
    }

    if (!nextDateSlot){
      workingDayDetails['nextDaySlotText'] = 'No slot available'
    }
    else if(nextDateSlot && nextDateSlot.working){
      workingDayDetails['nextDaySlotText'] = 'working'
    }
    else if(nextDateSlot && !nextDateSlot.working){
      workingDayDetails['nextDaySlotText'] = 'Not working'
    }
    workingDayDetails['currentDate']= new Date().toISOString();
    workingDayDetails['nextDate']= new Date(+new Date().setHours(0, 0, 0,0)+ 86400000);
    return workingDayDetails;
  }
}
