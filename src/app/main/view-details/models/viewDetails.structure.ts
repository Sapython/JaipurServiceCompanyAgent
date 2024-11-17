import { Booking } from 'src/app/shared/models/booking.structure';

export interface ViewDetailsState {
  booking: Booking | undefined;
  loadingBooking: boolean;
  pictureBeforeWork: string[];
  pictureAfterWork: string[];
}
