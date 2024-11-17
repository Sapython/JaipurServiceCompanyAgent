import { TestBed } from '@angular/core/testing';

import { IdentityproofService } from './identityproof.service';

describe('IdentityproofService', () => {
  let service: IdentityproofService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentityproofService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
