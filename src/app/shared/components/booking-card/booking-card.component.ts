import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from '../../models/booking.structure';
import { calcDistance } from 'src/distanceCalculator';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent implements OnInit {
  @Input({ required: true }) booking!: Booking;
  distance: number = 0;
  constructor(private router: Router) {
    // get current position of the device and calculate distance for this booking
    navigator.geolocation.getCurrentPosition((position) => {
      //TODO: waiting for customer app to add additional detail of coordinates in booking
      this.distance = calcDistance(
        position.coords.latitude,
        position.coords.longitude,
        Number(this.booking.address!.latitude),
        Number(this.booking.address!.longitude),
      );
    });
  }

  ngOnInit() {}
  checkDate(date:any){
   return  date.getTime() > new Date().getTime();
  }
}
