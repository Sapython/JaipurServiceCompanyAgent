import { User } from '@angular/fire/auth';
import { createAction, props } from '@ngrx/store';
import { AuthUserReadOnly } from '../models/app.structure';
import { Agent } from '../models/agent.structure';

export const loadUser = createAction('[App] Load User');

export const userLoaded = createAction(
  '[App] User Loaded',
  props<{ authInstance: AuthUserReadOnly; agentData: Agent }>(),
);

export const signupRequired = createAction(
  '[App] Signup Required',
  props<AuthUserReadOnly>(),
);

export const noUserFound = createAction('[App] No Signed In User Found');

export const errorWhileFetchingUser = createAction(
  '[App] Error when checking for user auth',
  props<{ error: string }>(),
);

export const signOut = createAction('[App] Sign Out');
