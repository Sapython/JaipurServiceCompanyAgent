import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobsDashboardPage } from './jobs-dashboard.page';

describe('JobsDashboardPage', () => {
  let component: JobsDashboardPage;
  let fixture: ComponentFixture<JobsDashboardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobsDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
