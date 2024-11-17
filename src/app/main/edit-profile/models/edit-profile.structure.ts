import { Timestamp } from '@angular/fire/firestore';

export interface EditProfileState {
  name: string;
  dateOfBirth: Timestamp;
  email: string;
  gender: string;
  photoUrl: string;
}
