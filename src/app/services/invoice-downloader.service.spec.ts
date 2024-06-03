import { TestBed } from '@angular/core/testing';

import { InvoiceDownloaderService } from './invoice-downloader.service';

describe('InvoiceDownloaderService', () => {
  let service: InvoiceDownloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceDownloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
