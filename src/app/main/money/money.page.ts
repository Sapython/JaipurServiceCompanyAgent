import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MoneyState } from './reducer/money.reducer';
import { Firestore } from '@angular/fire/firestore';
import { changeMonth } from './actions/month-change';
import { Booking } from 'src/app/shared/models/booking.structure';
interface Month {
  date: Date;
  name: string;
  percentage: string;
}

@Component({
  selector: 'app-money',
  templateUrl: './money.page.html',
  styleUrls: ['./money.page.scss'],
})
export class MoneyPage implements OnInit {
  months: Month[] = [];
  constructor(
    private router: Router,
    private store: Store<{ money: MoneyState }>,
    private firestore: Firestore,
  ) {}
  month$: Observable<Date> | null = null;
  totalEarning$: Observable<number> | null = null;
  totalDeduction$: Observable<number> | null = null;
  netEarning$: Observable<number> | null = null;
  history$: Observable<Booking[]> | null = null;
  isLoading$: Observable<any> | null = null;
  ngOnInit() {
    this.getDynamicMonth(new Date());
    this.store.dispatch(changeMonth({ date: new Date() }));
    this.month$ = this.store.select('money', 'month');
    this.totalEarning$ = this.store.select('money', 'totalEarning');
    this.totalDeduction$ = this.store.select('money', 'totalDeduction');
    this.netEarning$ = this.store.select('money', 'netEarning');
    this.history$ = this.store.select('money', 'currentSelectedMonthHistory');
    this.isLoading$ = this.store.select('money', 'isLoading');
  }

  getDynamicMonth(date: Date) {
    this.months = [];
    for (let index = 5; index >= 0; index--) {
      this.months.push({
        date: new Date(date.getFullYear(), date.getMonth() - index, 1),
        name: new Date(
          date.getFullYear(),
          date.getMonth() - index,
          1,
        ).toLocaleString('en-us', { month: 'short' }),
        percentage: Math.ceil(Math.random() * (100 - 50) + 50) + '%',
      });
    }
  }
}
