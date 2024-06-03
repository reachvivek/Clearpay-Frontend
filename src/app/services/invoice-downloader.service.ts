import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDownloaderService {
  private baseUrl = 'http://127.0.0.1:5000/get_invoice_pdf';
  // 'https://slmuat.cms.com:8085/UATMB/cms/MovePartRequest/PostedInvoiceReportPdfBase64';

  constructor(private http: HttpClient) {}

  getInvoicePdf(invoiceNo: string): Observable<any> {
    const url = `${this.baseUrl}?InvoiceNo=${encodeURIComponent(invoiceNo)}`;
    const username = 'WINSPIREADMIN';
    const password = 'winspire@123';
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    const headers = new HttpHeaders({
      Authorization: authHeader,
    });

    return this.http.get(url, { headers: headers }).pipe(
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
