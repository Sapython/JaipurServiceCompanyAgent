import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule, iosTransitionAnimation } from '@ionic/angular';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './shared/reducers/app.reducers';
import { AppService } from './shared/services/app.service';
import { AppEffects } from './shared/effects/app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FileService } from './shared/services/file.service';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      animated: true,
      navAnimation: iosTransitionAnimation,
    }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'jaipurservicecompany-demo',
        appId: '1:592897926378:web:40930077d0bc530a42a393',
        storageBucket: 'jaipurservicecompany-demo.appspot.com',
        apiKey: 'REPLACEMENT_STRING',
        authDomain: 'jaipurservicecompany-demo.firebaseapp.com',
        messagingSenderId: '592897926378',
        measurementId: 'G-495GPDZ9HG',
      }),
    ),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([AppEffects]),
    MatNativeDateModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    AppService,
    FileService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
