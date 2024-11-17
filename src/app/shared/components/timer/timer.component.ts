import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  date: any;
  @Input() targetDate: any ;
  difference: any;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentTime: any = ''
  @ViewChild('days', { static: true }) days: any;
  @ViewChild('hours', { static: true }) hours: any;
  @ViewChild('minutes', { static: true }) minutes: any;
  @ViewChild('seconds', { static: true }) seconds: any;

  constructor() {
  }
  ngOnInit() {
    console.log(this.targetDate);
    
this.currentTime = `${
  this.months[this.targetDate.getMonth()]
} ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;
setInterval(() => {
  this.difference = this.targetDate.getTime() - new Date().getTime();
  this.difference = this.difference / (1000 * 60 * 60 * 24);

  !isNaN(this.days.nativeElement.innerText)
    ? (this.days.nativeElement.innerText = Math.floor(this.difference))
    : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
    this.tickTock();
}, 1000);
  }
  ngAfterViewInit() {
    
  }

  tickTock() {
    this.date = new Date();
    this.days.nativeElement.innerText = Math.floor(this.difference);
    this.hours.nativeElement.innerText = 23 - this.date.getHours()+this.targetDate.getHours();
    this.minutes.nativeElement.innerText = 59 - this.date.getMinutes()+this.targetDate.getMinutes();
    this.seconds.nativeElement.innerText = 59 - this.date.getSeconds()+this.targetDate.getSeconds();
  }
}
