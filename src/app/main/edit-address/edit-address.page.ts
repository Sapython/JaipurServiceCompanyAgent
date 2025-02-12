import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import {
  Area,
  City,
  State,
} from 'src/app/auth/signup/models/address.structure';
import { SignupState } from 'src/app/auth/signup/models/signup.structure';
import {
  editAddressActions,
  editAddressAreasActions,
  editAddressCitiesActions,
  editAddressStateActions,
} from './actions';
import { MenuController, Platform } from '@ionic/angular';
import { LocationService } from 'src/app/shared/services/location.service';
import { AppState } from 'src/app/shared/models/app.structure';
import { Router } from '@angular/router';
import { AddressService } from 'src/app/auth/signup/services/address.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  addressForm: FormGroup = new FormGroup({
    state: new FormControl(),
    city: new FormControl(),
    pincode: new FormControl(),
    area: new FormControl(),
    street: new FormControl(),
  });
  currentPosition: google.maps.LatLngLiteral | undefined;
  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 24,
    lng: 12,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  zoom = 14;

  states$: Observable<State[]> | undefined;
  cities$: Observable<City[]> | undefined;
  areas$: Observable<Area[]> | undefined;
  agentData$ = this.store.select('app', 'agentData');
  userId: string | undefined;
  constructor(
    private store: Store<{ editAddress: SignupState; app: AppState }>,
    private platform: Platform,private toastService: ToastService,
    private locationService: LocationService,private router :Router, private  menuController : MenuController, private editAddressService : AddressService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(editAddressStateActions.LOAD());
    this.states$ = this.store.select('editAddress', 'states');
    this.cities$ = this.store.select('editAddress', 'cities');
    this.areas$ = this.store.select('editAddress', 'areas');
    this.agentData$.subscribe((agentData) => {
      this.userId = agentData?.uid;
    });
    // get current location
    this.getLocation();
    // this.agentData$.subscribe((agent)=>{
    //   if(agent){
    //     setTimeout(() => {
    //       alert("Setting data");
    //       this.addressForm.patchValue({
    //         state: agent.address.state.id,
    //         city: agent.address.city,
    //         pincode: agent.address.pinCode,
    //         area: agent.address.area,
    //         street: agent.address.addressLine,
    //       })
    //     },10000)
    //   }
    // })
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
    this.store.dispatch(
      editAddressCitiesActions.LOAD({ stateId: event.detail.value }),
    );
  }

  fetchAreas(event: any, stateId: string) {
    console.log(event);
    this.store.dispatch(
      editAddressAreasActions.LOAD({ stateId, cityId: event.detail.value.id }),
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
    // this.store.dispatch(
    //   editAddressActions.saveAddressAction({
    //     area: this.addressForm.value.area,
    //     city: this.addressForm.value.city,
    //     latitude: this.currentPosition?.lat || 0,
    //     longitude: this.currentPosition?.lng || 0,
    //     pincode: this.addressForm.value.pincode,
    //     state: this.addressForm.value.state,
    //     street: this.addressForm.value.street,
    //   }),
    // );
    // this.router.navigate(['main/home'])
    // this.menuController.open();

    if (this.addressForm.valid) {
      this.editAddressService.updateAddress(
        {
        area: this.addressForm.value.area,
        city: this.addressForm.value.city,
        geographicalPoint:{
        latitude: this.currentPosition?.lat || 0,
        longitude: this.currentPosition?.lng || 0,},
        pincode: this.addressForm.value.pincode,
        state: this.addressForm.value.state,
        addressLine: this.addressForm.value.street,
        },
        this.userId!,
      );
    } else {
      this.toastService.presentToast('Please fill all the fields');
    }
  }
}