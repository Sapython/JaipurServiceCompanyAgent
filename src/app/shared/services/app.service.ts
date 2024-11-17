import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  onAuthStateChanged,
  onIdTokenChanged,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Agent } from '../models/agent.structure';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  authState: Subject<User | null> = new Subject();
  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    onAuthStateChanged(this.auth, (state) => {
      this.authState.next(state);
    });
  }

  getUser(user: User | null): Observable<Agent | null> {
    if (!user) return Observable.create(null);
    return docData(doc(this.firestore, 'agents', user.uid), {
      idField: 'uid',
    }) as Observable<Agent>;
  }
}
