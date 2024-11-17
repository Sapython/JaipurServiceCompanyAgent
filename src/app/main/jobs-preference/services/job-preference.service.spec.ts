import { TestBed } from '@angular/core/testing';

import { JobPreferenceService } from './job-preference.service';

describe('JobPreferenceService', () => {
  let service: JobPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobPreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
