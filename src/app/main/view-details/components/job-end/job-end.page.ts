import { Component, Input, OnInit } from '@angular/core';
import { Booking } from 'src/app/shared/models/booking.structure';

@Component({
  selector: 'app-job-end',
  templateUrl: './job-end.page.html',
  styleUrls: ['./job-end.page.scss'],
})
export class JobEndPage implements OnInit {
  @Input({ required: true }) booking!: Booking;
  ngOnInit(): void {}
}
