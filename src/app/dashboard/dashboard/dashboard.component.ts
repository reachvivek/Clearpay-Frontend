import { Component } from '@angular/core';
import { InvoiceService } from '../../../swagger';
import { firstValueFrom } from 'rxjs';
import { UserSyncService } from '../../services/user-sync.service';
import { MessageService } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
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

  filters: {
    bank: string;
    invoiceYear: string;
    invoiceMonth: string;
    state: string;
    lho: string;
    serviceType: string;
  } = {
    bank: '',
    invoiceYear: '',
    invoiceMonth: '',
    state: '',
    lho: '',
    serviceType: '',
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

  uploadedFiles: any[] = [];

  constructor(
    private userSyncService: UserSyncService,
    private invoiceService: InvoiceService,
    private messageService: MessageService
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
      this.banks = res['banks']?.split(',');
      this.invoiceYears = res['invoiceYears']?.split(',');
      this.invoiceMonths = res['invoiceMonths']?.split(',');
      const stateCodes = res['states'] ? res['states'].split(',') : [];
      this.states = stateCodes.map((code: any) => ({
        code,
        name: this.stateNames[code] || code,
      }));
      this.lhos = res['lhoNames']?.split(',');
      this.servicetypes = res['serviceTypes']?.split(',');
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

  async loadBills(
    filters: {
      bank: string;
      invoiceYear: string;
      invoiceMonth: string;
      state: string;
      lho: string;
      serviceType: string;
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
          filters?.serviceType
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
        console.log(this.bills);
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

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
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
  hideDialog() {}

  uploadAcknowledgement() {}
}
