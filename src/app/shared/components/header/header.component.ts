import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app.structure';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerName: any;
  @Input() backUrl: string = 'main/home';
  @Output() markAllNotificationsAsRead: EventEmitter<void> = new EventEmitter<void>();
  unreadNotifications: Observable<boolean> = this.store.select(
    'app',
    'unreadNotifications',
  );
  constructor(
    public router: Router,
    public location: Location,
    private store: Store<{ app: AppState }>,
  ) {}

  ngOnInit() {}
  navigateTo() {
    this.router.navigate(['main/notification']);
  }
  markallRead(){
    this.markAllNotificationsAsRead.emit();
   }
}
