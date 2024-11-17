import { Injectable, NgZone } from '@angular/core';
import { Auth, getAuth, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,private router : Router,private ngZone: NgZone
  ) {}

  async signOut() {
    
    await this.ngZone.runOutsideAngular(() => {
       signOut(this.auth)
        });
  }
  

  async doesUserExist(uid: string): Promise<boolean> {
    return (await getDoc(doc(this.firestore, `agents/${uid}`))).exists();
  }

  getAgent(uid: string) {
    return getDoc(doc(this.firestore, `agents/${uid}`));
  }
}
