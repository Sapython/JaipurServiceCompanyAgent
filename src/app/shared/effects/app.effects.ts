import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppService } from '../services/app.service';
import {
  Subject,
  catchError,
  combineLatest,
  combineLatestWith,
  exhaustMap,
  filter,
  map,
  mergeMap,
  of,
  takeUntil,
  tap,
} from 'rxjs';
import {
  errorWhileFetchingUser,
  noUserFound,
  signupRequired,
  userLoaded,
  userUpdated,
} from '../actions';
import { AuthService } from '../services/auth.service';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@capacitor/app';
import { NotificationsService } from '../services/notifications.service';
import {
  notificationFailed,
  notificationLoaded,
} from '../actions/notification.actions';
import { ToastService } from '../services/toast.service';
import { SplashscreenService } from '../services/splashscreen.service';
import { Agent } from '../models/agent.structure';
import { logout } from 'src/app/main/home/actions';

@Injectable()
export class AppEffects {
  userUpdated: Subject<Agent> = new Subject<Agent>();
  constructor(
    private actions$: Actions,
    private appService: AppService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router,
    private store: Store<{ app: AppState }>,
    private splashScreenService: SplashscreenService,
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[App] Load User'),
      exhaustMap(() =>
        this.appService.authState.pipe(
          filter((user) => {
            let copy = JSON.parse(JSON.stringify(user));
            if (copy == null) {
              this.store.dispatch(noUserFound());
              return false;
            }
            else{
              return copy !== null;
            }
            
          }),
          mergeMap((user) => {
            return combineLatest([of(JSON.parse(JSON.stringify(user))), this.appService.getUser(JSON.parse(JSON.stringify(user)))]);
          }),
          map(([user, userInstance]) => {
            let copy = JSON.parse(JSON.stringify(user));
            let json: any = copy;
            if (userInstance) {
              this.store.dispatch(
                userUpdated({ agent: userInstance, user: copy! }),
              );
              console.log('User found in database', userInstance);
              return userLoaded({
                authInstance: {
                  uid: json.uid,
                  apiKey: json.apiKey,
                  displayName: json.displayName,
                  email: json.email,
                  emailVerified: json.emailVerified,
                  isAnonymous: json.isAnonymous,
                  appName: json.appName,
                  phoneNumber: json.phoneNumber,
                  createdAt: Timestamp.fromDate(new Date(json.createdAt)),
                  lastLoginAt: Timestamp.fromDate(new Date(json.lastLoginAt)),
                },
                agentData: userInstance,
              });
            } else {
              return signupRequired({
                uid: json.uid,
                apiKey: json.apiKey,
                displayName: json.displayName,
                email: json.email,
                emailVerified: json.emailVerified,
                isAnonymous: json.isAnonymous,
                appName: json.appName,
                phoneNumber: json.phoneNumber,
                createdAt: Timestamp.fromDate(new Date(json.createdAt)),
                lastLoginAt: Timestamp.fromDate(new Date(json.lastLoginAt)),
              });
            }
          }),
          catchError(async (error) => errorWhileFetchingUser(error))
        ),
      ),
    ),
  );

  updateNotificationToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userUpdated),
        filter((user) => {
          let copy = JSON.parse(JSON.stringify(user));
          if (copy == null) {
            this.store.dispatch(noUserFound());
            return false;
          }
          else{
            return copy !== null;
          }
          
        }),
        combineLatestWith(
          this.notificationsService.notificationRegistrationToken,
        ),
        mergeMap(([action, token]) => {
          if (token && action && action.agent.notificationToken !== token) {
            return this.notificationsService.updateNotificationToken(
              action.user,
              token,
            );
          } else {
            return of(null);
          }
        }),
        takeUntil(this.actions$.pipe(ofType(logout.logout)))
      ),
    { dispatch: false },
  );

  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout.logout),
      filter((user) => {
        let copy = JSON.parse(JSON.stringify(user));
        if (copy == null) {
          this.store.dispatch(noUserFound());
          return false;
        }
        else{
          return copy !== null;
        }
        
      }),
      exhaustMap(() => {
        return {
                ...this.authService.signOut().then(() => {
                  console.log('Sign Out successful');
                  location.reload();
                  return noUserFound();
                })
                .catch((error) => {
                  console.log('Failed signout', error);
                  return errorWhileFetchingUser(error);
                })
              }

        }
      ),
    ),
  );

  navigateToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType('[App] User Loaded'),
        filter((user) => {
          let copy = JSON.parse(JSON.stringify(user));
          if (copy == null) {
            this.store.dispatch(noUserFound());
            return false;
          }
          else{
            return copy !== null;
          }
          
        }),
        map(() => {
          if (this.router.url.includes('auth') || this.router.url == '/') {
            this.splashScreenService.hideSplashScreen();
            this.router.navigate(['/main/home']);
          }
          // this.toastService.presentToast('Welcome back!');
          // this.router.navigate(['/main/home']); // MAIN ROUTE
        }),
        takeUntil(this.actions$.pipe(ofType(logout.logout)))
      ),
    {
      dispatch: false,
    },
  );

  navigateToSignup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType('[App] Signup Required'),
        filter((user) => {
          let copy = JSON.parse(JSON.stringify(user));
          if (copy == null) {
            this.store.dispatch(noUserFound());
            return false;
          }
          else{
            return copy !== null;
          }
          
        }),
        map(() => {
          this.splashScreenService.hideSplashScreen();
          this.router.navigate(['auth', 'signup']);
        }),
      ),
    {
      dispatch: false,
    },
  );

  navigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType('[App] No Signed In User Found'),
        map(() => {
          this.splashScreenService.hideSplashScreen();
          this.router.navigate(['auth', 'login']);
        }),
      ),
    {
      dispatch: false,
    },
  );

  fetchNotifications$ = createEffect(() =>
    // on user loaded
    // fetch notifications
    // store in state
    // on user signout
    // clear notifications
    this.actions$.pipe(
      ofType('[App] User Loaded'),
      filter((user) => {
        let copy = JSON.parse(JSON.stringify(user));
        if (copy == null) {
          this.store.dispatch(noUserFound());
          return false;
        }
        else{
          return copy !== null;
        }
      }),
      mergeMap((user) => {
        return this.notificationsService.getNotifications(user);
      }),
      map((notifications) => {
        return notificationLoaded({
          notifications : notifications,
          unreadNotifications: notifications.some(
            (notification) => !notification.read,
          ),
        });
      }),
      catchError(async (error) => notificationFailed(error)),
      takeUntil(this.actions$.pipe(ofType(logout.logout)))
    ),
  );
}
