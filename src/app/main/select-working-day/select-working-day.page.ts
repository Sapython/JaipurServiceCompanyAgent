import { Component, OnInit } from '@angular/core';
import { Slot } from './models/slot.structure';
import { SlotService } from './services/slot.service';
import { AppState } from 'src/app/shared/models/app.structure';
import { Store } from '@ngrx/store';
import { Timestamp } from '@angular/fire/firestore';
import {
  SelectWorkingDayPageState,
  TimeSlot,
} from './models/select-working-day.structure';
import {
  disableTimeSlot,
  disableWorkingHour,
  enableTimeSlot,
  enableWorkingHour,
  loadInitialData,
  saveSlotDetails,
  selectDate,
  setAsNonWorking,
  setAsWorking,
  setJobPerday,
} from './actions/select-working-day.actions';
import { Observable, combineLatest, map, mergeMap } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-working-day',
  templateUrl: './select-working-day.page.html',
  styleUrls: ['./select-working-day.page.scss'],
})
export class SelectWorkingDayPage implements OnInit {
  slots: Observable<Slot[]> = this.store.select(
    'selectWorkingDay',
    'weekSlots',
  );
  working: Observable<boolean | Timestamp> = this.store.select(
    'selectWorkingDay',
    'agentWorking',
  );
  timeSlots: Observable<TimeSlot[]> = this.store.select(
    'selectWorkingDay',
    'timeSlots',
  );
  jobsPerDay: Observable<number> = this.store.select(
    'selectWorkingDay',
    'jobPerDay',
  );
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  today: Date = new Date();

  constructor(
    private store: Store<{
      app: AppState;
      selectWorkingDay: SelectWorkingDayPageState;
    }>,
  ) {}

  ngOnInit() {
    this.store.dispatch(loadInitialData());
  }

  setAsWorking() {
    this.store.dispatch(setAsWorking());
  }

  setAsNonWorking(value: boolean | Date | Timestamp) {
    if (value instanceof Date) {
      value = Timestamp.fromDate(value);
    }
    this.store.dispatch(setAsNonWorking({ day: value }));
  }

  selectSlot(index: number) {
    this.store.dispatch(selectDate({ index }));
  }

  setPerDayJob(event: any) {
    console.log(event.detail.value);
    this.store.dispatch(setJobPerday({ jobPerDay: event.detail.value }));
  }

  toggleDateSlot(enable: boolean, slot: Slot) {
    if (enable) {
      this.store.dispatch(enableWorkingHour({ id: slot.id }));
    } else {
      this.store.dispatch(disableWorkingHour({ id: slot.id }));
    }
  }

  toggleTimeSlot(hour: TimeSlot) {
    if (hour.enabled) {
      this.store.dispatch(disableTimeSlot({ id: hour.id }));
    } else {
      this.store.dispatch(enableTimeSlot({ id: hour.id }));
    }
  }
  

  save() {
    this.store.dispatch(saveSlotDetails());
  }
}
