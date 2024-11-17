import { createAction, props } from '@ngrx/store';
import { Agent } from '../models/agent.structure';
import { User } from '@angular/fire/auth';

export const loadUserFromDatabase = createAction(
  '[App] Load Current User',
  props<{ userId: string }>(),
);

export const userLoadedFromDatabase = createAction(
  '[App] Current User Loaded',
  props<Agent>(),
);

export const userUpdated = createAction(
  '[App] User Updated',
  props<{ agent: Agent; user: User }>(),
);
