import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectWorkingDayPage } from './select-working-day.page';

describe('SelectWorkingDayPage', () => {
  let component: SelectWorkingDayPage;
  let fixture: ComponentFixture<SelectWorkingDayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectWorkingDayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
