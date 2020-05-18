import { TestBed } from '@angular/core/testing';

import { StatusCodeService } from './status-code.service';

describe('StatusCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusCodeService = TestBed.get(StatusCodeService);
    expect(service).toBeTruthy();
  });
});
