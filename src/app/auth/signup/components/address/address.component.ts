import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom, take } from 'rxjs';
import { Area, City, State } from '../../models/address.structure';
import { Store } from '@ngrx/store';
import { SignupState } from '../../models/signup.structure';
import { areasActions, citiesActions, signupActions } from '../../actions';
import { LocationService } from 'src/app/shared/services/location.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  addressForm: FormGroup = new FormGroup({
    state: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required]),
    area: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
  });
  currentPosition: google.maps.LatLngLiteral | undefined;
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  zoom = 14;
  locationForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    hours: new FormControl(0, Validators.required),
  });
  states$: Observable<State[]> | undefined;
  cities$: Observable<City[]> | undefined;
  areas$: Observable<Area[]> | undefined;
  constructor(
    private store: Store<{ signup: SignupState }>,
    private locationService: LocationService,
    private platform: Platform,
  ) {}

  ngOnInit(): void {
    this.states$ = this.store.select('signup', 'states');
    this.cities$ = this.store.select('signup', 'cities');
    this.areas$ = this.store.select('signup', 'areas');
    // get current location
    if (navigator.geolocation) {
      this.getLocation();
    }
  }
  getLocation() {
    if (this.platform.is('capacitor')) {
      firstValueFrom(this.locationService.currentLocation).then((position) => {
        this.currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        },
        (error) => {
          setTimeout(() => this.getLocation(), 500);
        },
      );
    }
  }
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center = event.latLng.toJSON();
      this.currentPosition = event.latLng.toJSON();
    }
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  newPosition(event: any) {
    console.log(event);
    this.currentPosition = event.latLng.toJSON();
  }

  fetchCities(event: any) {
    console.log(event);
    this.store.dispatch(citiesActions.LOAD({ stateId: event.detail.value.id }));
  }

  fetchAreas(event: any, stateId: string) {
    console.log(event);
    this.store.dispatch(
      areasActions.LOAD({ stateId, cityId: event.detail.value.id }),
    );
  }

  fetchPostalCode(event: any) {
    console.log(event);
    let area = event.detail.value as Area;
    let postalCode = area.address_components.find((component: any) =>
      component.types.includes('postal_code'),
    );
    this.addressForm.patchValue({ pincode: postalCode?.long_name });
  }

  submit() {
    this.store.dispatch(
      signupActions.setAddressDetails({
        area: this.addressForm.value.area,
        city: this.addressForm.value.city,
        latitude: this.currentPosition?.lat || 0,
        longitude: this.currentPosition?.lng || 0,
        pincode: this.addressForm.value.pincode,
        state: this.addressForm.value.state,
        street: this.addressForm.value.street,
      }),
    );
  }
}
