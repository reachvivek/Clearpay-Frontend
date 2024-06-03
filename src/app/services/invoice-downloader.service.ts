import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/prod/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDownloaderService {
  constructor(private http: HttpClient) {}

  getInvoicePdf(invoiceNo: string): Observable<any> {
    const url = `${
      environment.BASE_PATH
    }/Invoice/GetInvoicePdf?invoiceNo=${encodeURIComponent(invoiceNo)}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response && response.Success === 'True' && response.Base64) {
          return this.base64ToBlob(response.Base64, 'application/pdf');
        }
        throw new Error('Failed to fetch the PDF');
      })
    );
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
}
