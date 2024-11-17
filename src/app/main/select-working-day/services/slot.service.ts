import { Injectable } from '@angular/core';
import {
  doc,
  getDoc,
  Firestore,
  Timestamp,
  setDoc,
  getDocs,
  collection,
} from '@angular/fire/firestore';
import { Slot } from '../models/slot.structure';
import { TimeSlot } from '../models/select-working-day.structure';

@Injectable({
  providedIn: 'root',
})
export class SlotService {
  constructor(private firestore: Firestore) {}

  async getTimeSlots() {
    return getDocs(collection(this.firestore, 'slots'));
  }

  async getSlots(userId: string) {
    let startDate = new Date();
    let slots: Slot[] = [];
    await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        let docData = await getDoc(
          doc(
            this.firestore,
            'agents',
            userId,
            'slots',
            new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
          ),
        );
        if (docData.exists()) {
          slots.push({ ...docData.data(), id: docData.id } as Slot);
        } else {
          let newDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
          slots.push({
            id: newDate.toISOString().split('T')[0],
            day: Timestamp.fromDate(newDate),
            working: true,
            bookings: [],
          });
        }
      }),
    );
    console.log(slots);
    return slots;
  }

  saveSlots(userId: string, slots: Slot[]) {
    return Promise.all(
      slots.map(async (slot) => {
        if (slot.id) {
          await setDoc(
            doc(this.firestore, `agents/${userId}/slots/${slot.id}`),
            slot,
          );
        } else {
          slot.id = new Date(slot.day.toDate().getTime())
            .toISOString()
            .split('T')[0];
          await setDoc(
            doc(this.firestore, `agents/${userId}/slots/${slot.id}`),
            slot,
          );
        }
      }),
    );
  }

  setWorkingStatus(userId: string, working: boolean | Timestamp,perDayJobs: number,workingHours: TimeSlot[]) {
    return setDoc(
      doc(this.firestore, `agents/${userId}`),
      { working, perDayJobs,workingHours },
      { merge: true },
    );
  }
}
