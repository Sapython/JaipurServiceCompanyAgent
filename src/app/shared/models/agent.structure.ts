import { GeoPoint } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import {
  Area,
  City,
  State,
} from 'src/app/auth/signup/models/address.structure';
import { TimeSlot } from 'src/app/main/select-working-day/models/select-working-day.structure';

export interface Agent {
  address: Address;
  email: string;
  name: string;
  dateOfBirth: Timestamp;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  photoUrl: string;
  uid: string;
  userProofDocument: UserProofDocument;
  selectedAreas: {
    stateId: string;
    cityId: string;
    areaId: string;
    serviceCatalogue : string;
  }[];
  selectedJobSubCategories: {
    categoryId: string;
    subCategoryId: string;
    areaId : string,
    serviceCatalogue : string
  }[];
  working: boolean | Timestamp;
  perDayJobs: number;
  workingHours: TimeSlot[];
  notificationToken?: string;
  active: Boolean,
  createdDate : Timestamp
}

export interface Address {
  state: State;
  city: City;
  area: Area;
  pinCode: string;
  addressLine: string;
  geographicalPoint: GeoPoint;
}

export interface UserProofDocument {
  aadhaarNumber: string;
  aadhaarImageUrl: string;
  panNumber: string;
  panUrl: string;
}
