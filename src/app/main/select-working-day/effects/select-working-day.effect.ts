import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  initialDataLoaded,
  loadInitialData,
  saveSlotDetails,
  saveSlotDetailsFailed,
  slotDetailsSaved,
} from '../actions/select-working-day.actions';
import {
  catchError,
  combineLatestWith,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';
import { SlotService } from '../services/slot.service';
import {
  SelectWorkingDayPageState,
  TimeSlot,
} from '../models/select-working-day.structure';
import { ToastService } from 'src/app/shared/services/toast.service';
import { workingSlots } from '../../home/actions';

@Injectable()
export class SelectWorkingDayPageEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{
      app: AppState;
      selectWorkingDay: SelectWorkingDayPageState;
    }>,
    private slotService: SlotService,
    private toastService: ToastService,
  ) {}

  loadInitialData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInitialData),
      combineLatestWith(
        from(this.slotService.getTimeSlots()).pipe(
          map((timeSlots) =>
            timeSlots.docs.map((doc) => {
              return { id: doc.id, ...doc.data() } as TimeSlot;
            }),
          ),
          map((timeSlots) => {
            let slots =  timeSlots.filter((timeSlot) => timeSlot.active)
            slots = slots?.sort((a:any, b:any) => a.index - b.index)
            return slots;
          }),
        ),
        this.store.select('app', 'agentData'),
      ),
      switchMap(([action, timeSlots, agentData]) => {
        return from(this.slotService.getSlots(agentData!.uid)).pipe(
          tap((d) => console.log(agentData)),
          map((slots) =>
            initialDataLoaded({
              slots: slots,
              working: agentData!.working,
              jobPerDay: agentData!.perDayJobs,
              timeSlots: timeSlots.map((timeSlot) => {
                return {
                  ...timeSlot,
                  enabled: agentData?.workingHours?.find((slot) =>slot.id === timeSlot.id && slot.enabled) ? true : false, // remove slot.id === timeSlot.id && 
                } as TimeSlot;
              }),
            }),
          ),
          catchError((error) => {
            throw error;
          }),
        );
      }),
    ),
  );

  saveSlotDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveSlotDetails),
      withLatestFrom(
        this.store.select('app', 'agentData'),
        this.store.select('selectWorkingDay'),
      ),
      mergeMap(([action, agentData, selectWorkingDay]) => {
        // update the agent working status
        // update the slots under agent
        let loader = this.toastService.presentLoading(
          'Saving the slot details',
        );
        return from(
          Promise.all([
            this.slotService.saveSlots(
              agentData!.uid,
              selectWorkingDay.weekSlots,
            ),
            this.slotService.setWorkingStatus(
              agentData!.uid,
              selectWorkingDay.agentWorking,
              selectWorkingDay.jobPerDay,
              selectWorkingDay.timeSlots
            ),
          ]),
        ).pipe(
          map(() => {
            this.store.dispatch(workingSlots.LOAD_ACTION());
            return slotDetailsSaved()}
          ),
          catchError((error) => of(saveSlotDetailsFailed({ error: error }))),
          tap(async () => {
            (await loader).dismiss();
            this.toastService.presentToast('Slot details saved');
          }),
        );
      }),
    ),
  );
  
}
