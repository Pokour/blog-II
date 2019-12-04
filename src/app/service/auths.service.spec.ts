import { TestBed } from '@angular/core/testing';

import { AuthsService } from './auths.service';

describe('AuthsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthsService = TestBed.get(AuthsService);
    expect(service).toBeTruthy();
  });
});
