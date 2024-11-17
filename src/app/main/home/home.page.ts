import { Component, OnInit } from '@angular/core';
import { AcceptancePendingJob, HomeState } from './model/home.structure';
import { Store } from '@ngrx/store';
import { acceptJob, acceptedJobs, acceptedPending, areaCatlog, rejectJob, workingSlots } from './actions';
import { Observable, map } from 'rxjs';
import { Booking } from 'src/app/shared/models/booking.structure';
import { Slot } from '../select-working-day/models/slot.structure';
import { Router } from '@angular/router';
import { HomeService } from './services/home.service';
import { AppState } from 'src/app/shared/models/app.structure';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  salutation: string | undefined;
  todaySlot: Slot | undefined;
  tomorrowSlot: Slot | undefined;
  loadingAcceptedJobs: boolean = false;
  workingSlotsData$: Observable<Booking[]> | null = null;
  acceptedJobs$: Observable<Booking[]> = this.store.select(
    'home',
    'acceptedJobs',
  );
  agentName: Observable<any> = this.store
    .select('app', 'agentData')
    .pipe(map((agentData) => agentData?.name));
  acceptancePendingJobs$: Observable<AcceptancePendingJob[]> =
    this.store.select('home', 'acceptancePendingJobs');
  workingSlotsData: any;
  constructor(
    private store: Store<{ home: HomeState; app: AppState }>,
    private router: Router,
    private homeService: HomeService,
    private actionPerformed: Store<{ app: AcceptancePendingJob }>,
  ) {}

  ngOnInit() {
    this.store.subscribe((res) => {
      this.loadingAcceptedJobs = res?.home?.loadingAcceptedJobs;
    });
    this.store.dispatch(acceptedJobs.LOAD_ACTION());
    this.store.dispatch(acceptedPending.LOAD_ACTION());
    this.store.dispatch(workingSlots.LOAD_ACTION());
    this.workingSlotsData$ = this.store.select('home', 'workingSlotsData');
    this.workingSlotsData$.subscribe((ev:any) => {
      this.workingSlotsData = ev;      
    });
    let date = new Date();
    let hour = date.getHours();
    if (hour >= 0 && hour < 12) {
      this.salutation = 'Good Morning';
    } else if (hour >= 12 && hour < 16) {
      this.salutation = 'Good Afternoon';
    } else if (hour >= 16 && hour < 20) {
      this.salutation = 'Good Evening';
    } else {
      this.salutation = 'Good Night';
    }
    this.store.dispatch(areaCatlog.loadAreasAction());
  }

  // pending jobs

  accept(job: AcceptancePendingJob) {
    this.store.dispatch(acceptJob.ACCEPT({ job }));
  }

  reject(job: AcceptancePendingJob) {
    this.store.dispatch(rejectJob.REJECT({ job }));
  }
}
