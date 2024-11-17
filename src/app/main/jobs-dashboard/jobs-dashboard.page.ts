import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from 'src/app/shared/models/booking.structure';
import { Store } from '@ngrx/store';
import {
  DateRange,
  JobsDashBoardState,
} from './reducer/jobs-dashboard.reducer';
import {
  cancelledJobs,
  completedJobs,
  inProgressJobs,
  pendingJobs,
} from './actions';
import { Observable } from 'rxjs';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-jobs-dashboard',
  templateUrl: './jobs-dashboard.page.html',
  styleUrls: ['./jobs-dashboard.page.scss'],
})
export class JobsDashboardPage implements OnInit {
  bookings: Booking[] = [];
  selectedSection: string = 'pending';
  inProgressJobs: any = {};
  pendingJobs: any = {};
  completedJobs: any = {};
  cancelledJobs: any = {};
  pendingJobs$: Observable<Booking[]> | null = null;
  inProgressJobs$: Observable<Booking[]> | null = null;
  cancelledJobs$: Observable<Booking[]> | null = null;
  completedJobs$: Observable<Booking[]> | null = null;
  isLoading$: Observable<any> | null = null;

  completedJobDateRange = new FormGroup({
    start: new FormControl<Date | null>(new Date()),
    end: new FormControl<Date | null>(new Date()),
  });
  cancelledJobsDateRange = new FormGroup({
    start: new FormControl<Date | null>(new Date()),
    end: new FormControl<Date | null>(new Date()),
  });
  today: Date = new Date();
  objectKeys = Object.keys;
  constructor(
    private router: Router,
    private store: Store<{ jobDashBoard: JobsDashBoardState }>,
  ) {}

  ngOnInit() {
    this.showSection('pending');
    this.pendingJobs$ = this.store.select('jobDashBoard', 'pendingJobs');
    this.pendingJobs$.subscribe((ev: any) => {
      this.pendingJobs = this.groupBookingsData(ev);
    });
    this.inProgressJobs$ = this.store.select('jobDashBoard', 'inProgressJobs');
    this.inProgressJobs$.subscribe((ev) => {
      this.inProgressJobs = this.groupBookingsData(ev);
    });
    this.completedJobs$ = this.store.select('jobDashBoard', 'completedJobs');
    this.completedJobs$.subscribe((ev) => {
      this.completedJobs = this.groupBookingsData(ev);
    });
    this.cancelledJobs$ = this.store.select('jobDashBoard', 'cancelledJobs');
    this.cancelledJobs$.subscribe((ev) => {
      this.cancelledJobs = this.groupBookingsData(ev);
    });
    this.isLoading$ = this.store.select('jobDashBoard', 'isLoading');
  }

  showSection(section: string): void {
    this.selectedSection = section;
    switch (section) {
      case 'pending': {
        this.store.dispatch(pendingJobs.LOAD_ACTION());
        break;
      }
      case 'ongoing': {
        this.store.dispatch(inProgressJobs.LOAD_ACTION());
        break;
      }
      case 'completed': {
        let dateRange: DateRange = {
          start: new Date(this.completedJobDateRange.value.start || new Date()),
          end: new Date(this.completedJobDateRange.value.end || new Date()),
        };
        this.store.dispatch(
          completedJobs.LOAD_ACTION({ dateRange: dateRange }),
        );
        break;
      }
      case 'cancelled': {
        let dateRange: DateRange = {
          start: new Date(
            this.cancelledJobsDateRange.value.start || new Date(),
          ),
          end: new Date(this.cancelledJobsDateRange.value.end || new Date()),
        };
        this.store.dispatch(
          cancelledJobs.LOAD_ACTION({ dateRange: dateRange }),
        );
        break;
      }
    }
  }

  onIonInfinite(ev: any, section: string) {
    this.showSection(section);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  groupBookingsData(bookings: any) {
    const groups: any = {};
    bookings.forEach((booking: any) => {
      let createdAt: string = booking.createdAt
        .toDate()
        .toLocaleDateString('en-US');
      if (!groups[createdAt]) {
        groups[createdAt] = [];
      }
      groups[createdAt].push(booking);
    });
    return groups;
  }
}
