import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeMonth } from 'src/app/main/money/actions/month-change';
import { MoneyState } from 'src/app/main/money/reducer/money.reducer';

@Component({
  selector: 'app-bar-chart-make',
  templateUrl: './bar-chart-make.component.html',
  styleUrls: ['./bar-chart-make.component.scss'],
})
export class BarChartMakeComponent implements OnInit {
  currentSlectedMonth: string = '';
  @Input() months!: any;

  constructor(private store: Store<{ money: MoneyState }>) {}

  ngOnInit() {
    let month = this.store.select('money', 'month');
    month.subscribe(
      (date) =>
        (this.currentSlectedMonth = new Date(
          date.getFullYear(),
          date.getMonth() - 0,
          1,
        ).toLocaleString('en-us', { month: 'short' })),
    );
    console.log(this.currentSlectedMonth);

    console.log(this.months);
  }
  changeMonth(month: any) {
    this.currentSlectedMonth = month.name;
    console.log(new Date(month.date));

    this.store.dispatch(changeMonth({ date: new Date(month.date) }));
  }
}
