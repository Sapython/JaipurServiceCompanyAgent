import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { AppState } from './shared/models/app.structure';
import { loadUser, signOut } from './shared/actions';
import { Observable } from 'rxjs';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { NotificationsService } from './shared/services/notifications.service';
import { LocationService } from './shared/services/location.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'JaipurServiceCompanyAgent';
  stage:
    | Observable<
        'checkingAuth' | 'loggedIn' | 'loginRequired' | 'error' | 'loggedOut'
      >
    | undefined;
  constructor(
    private store: Store<{ app: AppState }>,
    private router: Router,
    private notificationsService: NotificationsService,
    private locationService: LocationService,
  ) {
    this.router.navigateByUrl('/');
    SplashScreen.show({
      autoHide: false,
    });
    this.notificationsService.initNotifications();
    this.locationService.initLocation();
  }

  ngOnInit(): void {
    this.store.dispatch(loadUser());
  }
}
