import { createAction, props } from '@ngrx/store';
import { Booking } from 'src/app/shared/models/booking.structure';

export const contactLoad = createAction('[Contact Page] Month Changed');
export const contactsLoadFailure = createAction(
  '[Contact Page] Contacts Load Failed',
  props<{ error: string }>(),
);
export const contactsLoadSuccess = createAction(
  '[Contact Page] Contacts Load Success',
  props<{ contacts: any[] }>(),
);
