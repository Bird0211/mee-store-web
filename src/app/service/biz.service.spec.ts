import { TestBed } from '@angular/core/testing';

import { BizService } from './biz.service';

describe('BizService', () => {
  let service: BizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
