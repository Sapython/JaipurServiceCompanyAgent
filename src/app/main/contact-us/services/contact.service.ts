import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionGroup,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private firestore: Firestore) {}

  async loadContacts(agentId: string) {
    let data = await getDocs(
      query(collectionGroup(this.firestore, 'contacts')),
    );

    return data.docs.map((ele) => {
      return { id: ele.id, ...ele.data() };
    });
  }
}
