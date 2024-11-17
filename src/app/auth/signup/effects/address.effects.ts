import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AddressService } from '../services/address.service';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs';
import { Area, City, State } from '../models/address.structure';
import { areasActions, citiesActions, stateActions } from '../actions';

@Injectable()
export class AddressEffects {
  constructor(
    private actions: Actions,
    private addressService: AddressService,
  ) {}

  loadStateEffect$ = createEffect(() =>
    this.actions.pipe(
      ofType(stateActions.LOAD),
      mergeMap(() => {
        console.log('AddressEffects');
        return this.addressService
          .loadStates()
          .then((data) =>
            stateActions.SUCCESS({
              states: data.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as State;
              }),
            }),
          )
          .catch(() =>
            stateActions.FAILED({ error: 'Error while loading states' }),
          );
      }),
    ),
  );

  loadCityEffect$ = createEffect(() =>
    this.actions.pipe(
      ofType(citiesActions.LOAD),
      mergeMap((action) => {
        console.log('AddressEffects load cities', action);
        return this.addressService
          .loadCities(action.stateId)
          .then((data) =>
            citiesActions.SUCCESS({
              cities: data.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as City;
              }).filter((city) => city.active === true),
            }),
          )
          .catch(() =>
            citiesActions.FAILED({ error: 'Error while loading states' }),
          );
      }),
    ),
  );

  loadAreaEffect$ = createEffect(() =>
    this.actions.pipe(
      ofType(areasActions.LOAD),
      mergeMap((action) => {
        console.log('AddressEffects');
        return this.addressService
          .loadAreas(action.stateId, action.cityId)
          .then((data) =>
            areasActions.SUCCESS({
              areas: data.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as Area;
              }),
            }),
          )
          .catch(() =>
            areasActions.FAILED({ error: 'Error while loading states' }),
          );
      }),
    ),
  );
}
