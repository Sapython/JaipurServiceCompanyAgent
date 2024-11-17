import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobsPreferencePage } from './jobs-preference.page';

describe('JobsPreferencePage', () => {
  let component: JobsPreferencePage;
  let fixture: ComponentFixture<JobsPreferencePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobsPreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
