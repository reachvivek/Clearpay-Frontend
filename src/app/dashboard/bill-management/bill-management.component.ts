import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserSyncService } from '../../services/user-sync.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceDownloaderService } from '../../services/invoice-downloader.service';
import { environment } from '../../../environments/prod/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUploadService, InvoiceService } from '../../../swagger';

@Component({
  selector: 'app-bill-management',
  templateUrl: './bill-management.component.html',
  styleUrl: './bill-management.component.scss',
})
export class BillManagementComponent {
  showLoader: boolean = false;
  showSubmissionDateDialog: boolean = false;
  showUploadAcknowledgementDialog: boolean = false;
  selectedBill: any = { billID: undefined };
  editBill: { submissionDate: Date | undefined } = {
    submissionDate: undefined,
  };
  dateFormat: string = 'dd/mm/yy';
  banks: string[] = [];
  invoiceYears: number[] = [];
  invoiceMonths: string[] = [];
  states: { code: string; name: string }[] = [];
  stateNames: { [code: string]: string } = {
    AD: 'Andhra Pradesh',
    AN: 'Andaman Nicobar',
    AR: 'Arunachal Pradesh',
    AS: 'Assam',
    BH: 'Bihar',
    CH: 'Chandigarh',
    CT: 'Chattisgarh',
    DD: 'Daman & Diu',
    DL: 'Delhi',
    DN: 'Dadra and Nagar Haveli',
    GA: 'Goa',
    GJ: 'Gujarat',
    HP: 'Himachal Pradesh',
    HR: 'Haryana',
    JH: 'Jharkhand',
    JK: 'Jammu & Kashmir',
    KA: 'Karnataka',
    KL: 'Kerala',
    LA: 'LADAKH',
    LD: 'Lakshadweep',
    ME: 'Meghalaya',
    MH: 'Maharashtra',
    MI: 'Mizoram',
    MN: 'Manipur',
    MP: 'Madhya Pradesh',
    NL: 'Nagaland',
    OR: 'Orissa',
    PB: 'Punjab',
    PY: 'Pondicherry',
    RJ: 'Rajasthan',
    SK: 'Sikkim',
    SZ: 'Maharashtra-SZ',
    TN: 'Tamil Nadu',
    TR: 'Tripura',
    TS: 'Telangana',
    UP: 'Uttar Pradesh',
    UT: 'Uttarakhand',
    WB: 'West Bengal',
  };
  lhos: string[] = [];
  servicetypes: string[] = [];
  glcodes: string[] = [];

  filters: {
    bank: string;
    invoiceYear: string;
    invoiceMonth: string;
    state: string;
    lho: string;
    serviceType: string;
    glCode: string;
  } = {
    bank: '',
    invoiceYear: '',
    invoiceMonth: '',
    state: '',
    lho: '',
    serviceType: '',
    glCode: '',
  };

  minDate: Date | undefined;
  maxDate: Date | undefined = new Date();
  items: any[] = [
    { label: 'Total', index: 1 },
    { label: 'Pending', index: 2 },
    { label: 'Processed', index: 3 },
  ];
  active_index: any = 1;

  type: any = 1;

  bills: any = [];

  pendingBills: any = [];

  processedBills: any = [];

  allBills: any = [];

  totalBillsCount: number = 0;
  pendingBillsCount: number = 0;
  processedBillsCount: number = 0;

  bill!: any;

  uploadedFiles: File[] = [];

  columns = [
    { field: 'invoiceNo', header: 'Invoice No' },
    { field: 'bankName', header: 'Bank' },
    { field: 'invoiceAmountWithGST', header: 'Invoice Amount' },
    { field: 'dateOfSubmission', header: 'Submission Date' },
    { field: 'ackProof', header: 'Acknowledgement' },
    { field: 'isProcessed', header: 'Status' },
  ];

  constructor(
    private userSyncService: UserSyncService,
    private invoiceService: InvoiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private invoiceDownloaderService: InvoiceDownloaderService,
    private fileDownloaderService: FileUploadService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.userSyncService.loadState();
    await this.loadBills();
    this.loadBillsCategorically(1);
    this.loadFilters();
  }

  async loadFilters() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.invoiceService.invoiceLoadFiltersGet()
      );
      this.banks = (res.banks ?? res.Banks)?.split(',');
      this.invoiceYears = (res.invoiceYears ?? res.InvoiceYears)?.split(',');
      this.invoiceMonths = (res.invoiceMonths ?? res.InvoiceMonths)?.split(',');
      const stateCodes = (res.states ?? res.States)?.split(',') ?? [];
      this.states = stateCodes.map((code: any) => ({
        code,
        name: this.stateNames[code] || code,
      }));
      this.lhos = (res.lhoNames ?? res.LhoNames)?.split(',');
      this.servicetypes = (res.serviceTypes ?? res.ServiceTypes)?.split(',');
      this.glcodes = (res.glCodes ?? res.GLCodes)?.split(',');
      this.glcodes = this.glcodes.filter((entry: any) => entry != '');
      this.showLoader = false;
    } catch (err: any) {
      console.log(err);
      this.showLoader = false;
    }
  }

  async applyFilters() {
    await this.loadBills(this.filters);
    await this.loadBillsCategorically(this.active_index);
  }

  isFilterApplied(): boolean {
    for (const key of Object.keys(this.filters) as Array<
      keyof typeof this.filters
    >) {
      if (this.filters[key] !== '') {
        return true;
      }
    }
    return false;
  }

  resetFilters() {
    (Object.keys(this.filters) as Array<keyof typeof this.filters>).forEach(
      (key) => {
        this.filters[key] = '';
      }
    );
    this.applyFilters();
  }

  async loadBills(
    filters: {
      bank: string;
      invoiceYear: string;
      invoiceMonth: string;
      state: string;
      lho: string;
      serviceType: string;
      glCode: string;
    } | null = null
  ) {
    this.showLoader = true;
    try {
      const allBills = await firstValueFrom(
        this.invoiceService.invoiceGetBillsGet(
          filters?.bank,
          filters?.invoiceYear,
          filters?.invoiceMonth,
          filters?.state,
          filters?.lho,
          filters?.serviceType,
          filters?.glCode
        )
      );

      this.allBills = [...allBills.bills!];
      this.totalBillsCount = allBills.totalBills!;
      this.pendingBillsCount = allBills.pendingBills!;
      this.processedBillsCount = allBills.processedBills!;

      this.processedBills = this.allBills.filter(
        (bill: any) => bill.isProcessed == 1
      );

      this.pendingBills = this.allBills.filter(
        (bill: any) => bill.isPending == 1
      );
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  deleteAcknowledgement(id: number, number: string) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete acknowledgement for Invoice ' +
        number +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'ms-2',
      accept: async () => {
        this.showLoader = true;
        try {
          const res = await firstValueFrom(
            this.fileDownloaderService.fileUploadDeleteAttachmentIdDelete(id, 1)
          );
          if (res && res.deleted) {
            this.messageService.add({
              severity: 'success',
              summary: 'Acknowledgement Deleted',
              detail: 'Acknowledgement Deleted Successfully',
            });
            await this.loadBills();
            this.loadFilters();
            this.loadBillsCategorically(1);
          }
        } catch (err: any) {
          console.error(err.error);
        }
        this.showLoader = false;
      },
    });
  }

  toggleSubmissionDateDialog(id: number | null = null) {
    this.showSubmissionDateDialog = !this.showSubmissionDateDialog;
    if (id) {
      this.selectedBill.billId = id;
    } else {
      this.selectedBill.billId = null;
    }
    if (this.showSubmissionDateDialog == false) {
      this.editBill.submissionDate = undefined;
    }
  }

  toggleUploadAcknowledgementDialog(id: number | null = null) {
    this.selectedBill.billId = id;
    this.showUploadAcknowledgementDialog =
      !this.showUploadAcknowledgementDialog;
  }

  loadBillsCategorically(ind: number) {
    this.active_index = ind;
    switch (ind) {
      case 1:
        this.bills = [...this.allBills];
        break;
      case 2:
        this.bills = [...this.pendingBills];
        break;
      case 3:
        this.bills = [...this.processedBills];
        break;
      default:
        this.bills = [...this.allBills];
        break;
    }
  }

  getExportFileName(): string {
    let fileName = '';
    switch (this.active_index) {
      case 1:
        fileName = `Total_Bills_${new Date().toLocaleString()}`;
        break;
      case 2:
        fileName = `Pending_Bills_${new Date().toLocaleString()}`;
        break;
      case 3:
        fileName = `Processed_Bills_${new Date().toLocaleString()}`;
        break;
      default:
        throw new Error('Invalid Index');
        break;
    }
    return fileName;
  }

  async onUpload(event: any) {
    this.showLoader = true;
    this.uploadedFiles = [];
    for (let file of event.files) {
      console.log(file);
      this.uploadedFiles.push(file);
    }

    const formData = new FormData();
    formData.append('BillID', this.selectedBill.billId);
    formData.append('Type', '1');

    // Append each file to FormData
    for (let file of this.uploadedFiles) {
      formData.append('Files', file, file.name);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')!}`,
    });
    // Now you can send formData to your API using HttpClient
    this.http
      .post(`${environment.BASE_PATH}/FileUpload/UploadFiles`, formData, {
        headers,
      })
      .subscribe(
        (response: any) => {
          if (response && response.url)
            this.messageService.add({
              severity: 'success',
              summary: 'Uploaded Successfully',
              detail: 'Acknowledgement Uploaded Successfully',
              life: 3000,
            });
          this.showLoader = false;
          this.uploadedFiles = [];
          this.toggleUploadAcknowledgementDialog();
          this.ngOnInit();
        },
        (error: any) => {
          console.error('Error uploading files', error);
          this.showLoader = false;
        }
      );
  }

  async downloadAcknowledgement(uri: string) {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.fileDownloaderService.fileUploadDownloadFilePost({ uri })
      );
      if (res && res.sasUrl) {
        window.open(res.sasUrl);
        this.showLoader = false;
      }
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  async addSubmissionDate() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.invoiceService.invoiceUpdateDateOfSubmissionPost({
          billId: this.selectedBill.billId,
          dateOfSubmission: this.selectedBill.submissionDate,
        })
      );
      this.toggleSubmissionDateDialog();
      if (res && res.updated) {
        await this.loadBills();
        this.loadBillsCategorically(1);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Date Of Submission Updated',
          life: 3000,
        });
        this.showLoader = false;
      }
    } catch (err: any) {
      console.log(err);
      this.showLoader = false;
    }
  }
  convertToString() {
    const dateToUpdate = this.editBill.submissionDate;
    const offset = dateToUpdate!.getTimezoneOffset();
    const updatedDate = new Date(dateToUpdate!.getTime() - offset * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.selectedBill.submissionDate = updatedDate;
    console.log(updatedDate);
  }

  async downloadInvoice(invoiceNo: string) {
    this.showLoader = true;
    this.invoiceDownloaderService.getInvoicePdf(invoiceNo).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoiceNo}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.showLoader = false;
      },
      (error: any) => {
        console.error('Error downloading the invoice:', error);
        this.showLoader = false;
      }
    );
  }
}
