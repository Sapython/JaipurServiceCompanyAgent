import { Timestamp } from '@angular/fire/firestore';
import { Booking } from 'src/app/shared/models/booking.structure';

export interface HomeState {
  salutation: 'Good Morning' | 'Good Afternoon' | 'Good Evening';
  customerName: string;
  workingHours: any;
  acceptancePendingJobs: AcceptancePendingJob[];
  loadingPendingJobs: boolean;
  acceptedJobs: Booking[];
  loadingAcceptedJobs: boolean;
  acceptPendingJobflag: boolean;
  workingSlotsData:any;
  areaServiceCatlog:any;
}

export interface Assignment {
  id: string;
  acceptanceTime: Timestamp;
  accepted: boolean;
  actionPerformed: boolean;
  agentId: string;
  bookingID: string;
  customerId: string;
  date: Timestamp;
}

export interface AcceptancePendingJob extends Assignment {
  bookingData: Booking;
}
