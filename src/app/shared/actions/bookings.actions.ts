import { createAction, props } from '@ngrx/store';

export const loadAssignedJobs = createAction('[App] Load Assigned Job');

export const assignedJobsLoaded = createAction(
  '[App] Assigned Jobs Loaded',
  props<{ bookings: any[] }>(),
);
