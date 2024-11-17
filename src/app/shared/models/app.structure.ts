import { User } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { AppNotification } from './notification.structure';
import { Agent } from './agent.structure';

export interface AppState {
  currentUser: AuthUserReadOnly | null;
  agentData: Agent | null;
  appStage: 'checkingAuth' | 'loggedIn' | 'loginRequired' | 'signupRequired';
  message: string;
  notifications: AppNotification[];
  unreadNotifications: boolean;
}

export interface AuthUserReadOnly {
  uid: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  apiKey: string;
  appName: string;
}
