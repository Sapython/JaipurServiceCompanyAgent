import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoneyPage } from './money.page';

describe('MoneyPage', () => {
  let component: MoneyPage;
  let fixture: ComponentFixture<MoneyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
