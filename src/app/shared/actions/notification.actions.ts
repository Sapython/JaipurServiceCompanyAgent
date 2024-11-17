import { createAction, props } from '@ngrx/store';
import { AppNotification } from '../models/notification.structure';

export const notificationLoaded = createAction(
  '[Notification] Notification Loaded',
  props<{ notifications: AppNotification[]; unreadNotifications: boolean }>(),
);
export const notificationFailed = createAction(
  '[Notification] Notification Failed',
  props<{ error: any }>(),
);
