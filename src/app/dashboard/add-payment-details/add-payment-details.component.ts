import { Component, Input } from '@angular/core';
import {
  InvoiceDetailsDto,
  InvoiceDetailsToUpdateDto,
  InvoiceService,
} from '../../../swagger';
import { firstValueFrom } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ExcelService } from '../../services/excel.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-payment-details',
  templateUrl: './add-payment-details.component.html',
  styleUrl: './add-payment-details.component.scss',
})
export class AddPaymentDetailsComponent {
  @Input('billId') billId: any;
  paymentDetails: InvoiceDetailsToUpdateDto | undefined = {};
  paymentDetails_Server: InvoiceDetailsDto | undefined = {};

  difference: any;
  showLoader: boolean = false;
  // Invoice Details
  cnDetails: any = {};
  dnDetails: any = {};
  withoutCNDetails: any = {};
  tdsDetails: any = {};
  gstTDSDetails: any = {};
  remainingDetails: any = {};

  invoiceTotal: number = 0;

  // Categorical Details
  fosDetails: any = {};
  downtimeDetails: any = {};
  cashoutpenaltyDetails: any = {};
  housekeepingDetails: any = {};
  rejectbinDetails: any = {};
  consumableDetails: any = {};
  dosDetails: any = {};
  excessbillingDetails: any = {};
  incentiveamountwithoutdnDetails: any = {};
  reconpenaltyDetails: any = {};
  ejdeductionDetails: any = {};
  essfootagesDetails: any = {};
  esurdowntimeDetails: any = {};
  esurnotinstalledDetails: any = {};
  craservicesissuesDetails: any = {};
  robberyDetails: any = {};
  cashmisappropriationDetails: any = {};

  categoricalTotal: number = 0;

  totalDetails: any = {};

  // Local View Variables
  dates: { invoiceAmountPaidDate: Date | undefined } = {
    invoiceAmountPaidDate: undefined,
  };
  dateFormat: string = 'dd/mm/yy';

  minDate: Date | undefined;
  maxDate: Date | undefined;

  constructor(
    private invoiceService: InvoiceService,
    private decimalPipe: DecimalPipe,
    private excelService: ExcelService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadBillDetails();
    if (this.paymentDetails_Server?.isProcessed == 0) {
      await this.loadFromLocalStorage();
      this.updateDifference(1);
      this.checkInvoiceTotal();
      this.checkCategoricalTotal();
    }
  }

  saveInvoiceDetails() {
    this.paymentDetails!.cnDetails = JSON.stringify(this.cnDetails);
    this.paymentDetails!.incentiveDNDetails = JSON.stringify(this.dnDetails);
    this.paymentDetails!.withoutCNDetails = JSON.stringify(
      this.withoutCNDetails
    );
    this.paymentDetails!.tdsDetails = JSON.stringify(this.tdsDetails);
    this.paymentDetails!.gsttdsDetails = JSON.stringify(this.gstTDSDetails);
    this.paymentDetails!.remainingDetails = JSON.stringify(
      this.remainingDetails
    );

    let savedHistory: InvoiceDetailsDto | undefined = JSON.parse(
      localStorage.getItem(this.billId)!
    );

    if (savedHistory) {
      savedHistory = { ...this.paymentDetails, ...savedHistory };
    } else {
      savedHistory = { ...this.paymentDetails };
    }
    localStorage.setItem(this.billId, JSON.stringify(savedHistory));
  }

  saveCategoricalDetails() {
    this.paymentDetails!.fosDetails = JSON.stringify(this.fosDetails);
    this.paymentDetails!.downtimeDetails = JSON.stringify(this.downtimeDetails);
    this.paymentDetails!.cashOutPenaltyDetails = JSON.stringify(
      this.cashoutpenaltyDetails
    );
    this.paymentDetails!.houseKeepingDetails = JSON.stringify(
      this.housekeepingDetails
    );
    this.paymentDetails!.rejectBinDetails = JSON.stringify(
      this.rejectbinDetails
    );
    this.paymentDetails!.consumableDetails = JSON.stringify(
      this.consumableDetails
    );
    this.paymentDetails!.dosDetails = JSON.stringify(this.dosDetails);
    this.paymentDetails!.excessBillingDetails = JSON.stringify(
      this.excessbillingDetails
    );
    this.paymentDetails!.incentiveAmountWithoutDNDetails = JSON.stringify(
      this.incentiveamountwithoutdnDetails
    );
    this.paymentDetails!.reconPenaltyDetails = JSON.stringify(
      this.reconpenaltyDetails
    );
    this.paymentDetails!.ejDeductionDetails = JSON.stringify(
      this.ejdeductionDetails
    );
    this.paymentDetails!.essFootagesDetails = JSON.stringify(
      this.essfootagesDetails
    );
    this.paymentDetails!.eSurDowntimeDetails = JSON.stringify(
      this.esurdowntimeDetails
    );
    this.paymentDetails!.eSurNotInstalledDetails = JSON.stringify(
      this.esurnotinstalledDetails
    );
    this.paymentDetails!.craServicesDetails = JSON.stringify(
      this.craservicesissuesDetails
    );
    this.paymentDetails!.robberyDetails = JSON.stringify(this.robberyDetails);
    this.paymentDetails!.cashMisappropriationDetails = JSON.stringify(
      this.cashmisappropriationDetails
    );
    console.log(this.paymentDetails);
    localStorage.setItem(this.billId, JSON.stringify(this.paymentDetails));
  }

  async loadFromLocalStorage() {
    try {
      const savedHistory: InvoiceDetailsDto | undefined = JSON.parse(
        localStorage.getItem(this.billId)!
      );
      // Summary Details
      if (savedHistory) {
        if (savedHistory.invoiceAmountPaid) {
          this.paymentDetails!.invoiceAmountPaid =
            savedHistory.invoiceAmountPaid;
        }
        if (savedHistory.invoiceAmountPaidDate) {
          this.dates.invoiceAmountPaidDate = new Date(
            savedHistory.invoiceAmountPaidDate
          );
        }

        // Invoice Details
        if (savedHistory.cnDetails) {
          this.cnDetails = JSON.parse(savedHistory.cnDetails);
        }
        if (savedHistory.incentiveDNDetails) {
          this.dnDetails = JSON.parse(savedHistory.incentiveDNDetails);
        }
        if (savedHistory.withoutCNDetails) {
          this.withoutCNDetails = JSON.parse(savedHistory.withoutCNDetails);
        }
        if (savedHistory.tdsDetails) {
          this.tdsDetails = JSON.parse(savedHistory.tdsDetails);
        }
        if (savedHistory.gsttdsDetails) {
          this.gstTDSDetails = JSON.parse(savedHistory.gsttdsDetails);
        }
        if (savedHistory.remainingDetails) {
          this.remainingDetails = JSON.parse(savedHistory.remainingDetails);
        }
        // Categorical Details
        if (savedHistory.fosDetails) {
          this.fosDetails = JSON.parse(savedHistory.fosDetails);
        }
        if (savedHistory.downtimeDetails) {
          this.downtimeDetails = JSON.parse(savedHistory.downtimeDetails);
        }
        if (savedHistory.cashOutPenaltyDetails) {
          this.cashoutpenaltyDetails = JSON.parse(
            savedHistory.cashOutPenaltyDetails
          );
        }
        if (savedHistory.houseKeepingDetails) {
          this.housekeepingDetails = JSON.parse(
            savedHistory.houseKeepingDetails
          );
        }
        if (savedHistory.rejectBinDetails) {
          this.rejectbinDetails = JSON.parse(savedHistory.rejectBinDetails);
        }
        if (savedHistory.consumableDetails) {
          this.consumableDetails = JSON.parse(savedHistory.consumableDetails);
        }
        if (savedHistory.dosDetails) {
          this.dosDetails = JSON.parse(savedHistory.dosDetails);
        }
        if (savedHistory.excessBillingDetails) {
          this.excessbillingDetails = JSON.parse(
            savedHistory.excessBillingDetails
          );
        }
        if (savedHistory.incentiveAmountWithoutDNDetails) {
          this.incentiveamountwithoutdnDetails = JSON.parse(
            savedHistory.incentiveAmountWithoutDNDetails
          );
        }
        if (savedHistory.reconPenaltyDetails) {
          this.reconpenaltyDetails = JSON.parse(
            savedHistory.reconPenaltyDetails
          );
        }
        if (savedHistory.ejDeductionDetails) {
          this.ejdeductionDetails = JSON.parse(savedHistory.ejDeductionDetails);
        }
        if (savedHistory.essFootagesDetails) {
          this.essfootagesDetails = JSON.parse(savedHistory.essFootagesDetails);
        }
        if (savedHistory.eSurDowntimeDetails) {
          this.esurdowntimeDetails = JSON.parse(
            savedHistory.eSurDowntimeDetails
          );
        }
        if (savedHistory.eSurNotInstalledDetails) {
          this.esurnotinstalledDetails = JSON.parse(
            savedHistory.eSurNotInstalledDetails
          );
        }
        if (savedHistory.craServicesDetails) {
          this.craservicesissuesDetails = JSON.parse(
            savedHistory.craServicesDetails
          );
        }
        if (savedHistory.robberyDetails) {
          this.robberyDetails = JSON.parse(savedHistory.robberyDetails);
        }
        if (savedHistory.cashMisappropriationDetails) {
          this.cashmisappropriationDetails = JSON.parse(
            savedHistory.cashMisappropriationDetails
          );
        }
        this.updateCategories();
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  updateCategories() {
    this.updateCategoricalTotal(1);
    this.updateCategoricalTotal(2);
    this.updateCategoricalTotal(3);
    this.updateCategoricalTotal(4);
    this.updateCategoricalTotal(5);
    this.updateCategoricalTotal(6);
    this.updateCategoricalTotal(7);
    this.updateCategoricalTotal(8);
    this.updateCategoricalTotal(9);
  }

  convertToString() {
    const dateToUpdate = this.dates.invoiceAmountPaidDate;
    const offset = dateToUpdate!.getTimezoneOffset();
    const updatedDate = new Date(dateToUpdate!.getTime() - offset * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.paymentDetails!.invoiceAmountPaidDate = updatedDate;
  }

  async submitPaymentDetails() {
    this.showLoader = true;
    this.paymentDetails!.billID = this.billId;
    try {
      const res = await firstValueFrom(
        this.invoiceService.invoiceUpdateInvoiceDetailsPost(this.paymentDetails)
      );
      if (res && res.updated) {
        this.messageService.add({
          severity: 'success',
          summary: 'Submitted Successfully',
          detail: 'Invoice Status Updated',
          life: 3000,
        });
      }
      this.showLoader = false;
      setTimeout(() => {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      }, 2000);
    } catch (err: any) {
      console.error(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Payment Details Submission Failed',
        life: 3000,
      });
    }
  }

  async loadBillDetails() {
    this.showLoader = true;
    try {
      const res = await firstValueFrom(
        this.invoiceService.invoiceGetInvoiceDetailsBillIdGet(this.billId)
      );
      if (res) {
        this.paymentDetails_Server = res;
        this.paymentDetails!.invoiceNo = this.paymentDetails_Server.invoiceNo;
        if (this.paymentDetails_Server.invoiceAmountPaid) {
          this.paymentDetails!.invoiceAmountPaid =
            this.paymentDetails_Server.invoiceAmountPaid;
        }
        if (this.paymentDetails_Server.invoiceAmountPaidDate) {
          this.dates.invoiceAmountPaidDate = new Date(
            this.paymentDetails_Server.invoiceAmountPaidDate
          );
        }
        if (this.paymentDetails_Server.invoiceAmountWithGST) {
          this.difference = this.paymentDetails_Server.invoiceAmountWithGST;
        }
        if (this.paymentDetails_Server.cnDetails) {
          this.cnDetails = JSON.parse(this.paymentDetails_Server.cnDetails);
        }
        if (this.paymentDetails_Server.incentiveDNDetails) {
          this.dnDetails = JSON.parse(
            this.paymentDetails_Server.incentiveDNDetails
          );
        }
        if (this.paymentDetails_Server.withoutCNDetails) {
          this.withoutCNDetails = JSON.parse(
            this.paymentDetails_Server.withoutCNDetails
          );
        }
        if (this.paymentDetails_Server.tdsDetails) {
          this.tdsDetails = JSON.parse(this.paymentDetails_Server.tdsDetails);
        }
        if (this.paymentDetails_Server.gsttdsDetails) {
          this.gstTDSDetails = JSON.parse(
            this.paymentDetails_Server.gsttdsDetails
          );
        }
        if (this.paymentDetails_Server.remainingDetails) {
          this.remainingDetails = JSON.parse(
            this.paymentDetails_Server.remainingDetails
          );
        }
        if (this.paymentDetails_Server.fosDetails) {
          this.fosDetails = JSON.parse(this.paymentDetails_Server.fosDetails);
        }
        if (this.paymentDetails_Server.downtimeDetails) {
          this.downtimeDetails = JSON.parse(
            this.paymentDetails_Server.downtimeDetails
          );
        }
        if (this.paymentDetails_Server.cashOutPenaltyDetails) {
          this.cashoutpenaltyDetails = JSON.parse(
            this.paymentDetails_Server.cashOutPenaltyDetails
          );
        }
        if (this.paymentDetails_Server.houseKeepingDetails) {
          this.housekeepingDetails = JSON.parse(
            this.paymentDetails_Server.houseKeepingDetails
          );
        }
        if (this.paymentDetails_Server.rejectBinDetails) {
          this.rejectbinDetails = JSON.parse(
            this.paymentDetails_Server.rejectBinDetails
          );
        }
        if (this.paymentDetails_Server.consumableDetails) {
          this.consumableDetails = JSON.parse(
            this.paymentDetails_Server.consumableDetails
          );
        }
        if (this.paymentDetails_Server.dosDetails) {
          this.dosDetails = JSON.parse(this.paymentDetails_Server.dosDetails);
        }
        if (this.paymentDetails_Server.excessBillingDetails) {
          this.excessbillingDetails = JSON.parse(
            this.paymentDetails_Server.excessBillingDetails
          );
        }
        if (this.paymentDetails_Server.incentiveAmountWithoutDNDetails) {
          this.incentiveamountwithoutdnDetails = JSON.parse(
            this.paymentDetails_Server.incentiveAmountWithoutDNDetails
          );
        }
        if (this.paymentDetails_Server.reconPenaltyDetails) {
          this.reconpenaltyDetails = JSON.parse(
            this.paymentDetails_Server.reconPenaltyDetails
          );
        }
        if (this.paymentDetails_Server.ejDeductionDetails) {
          this.ejdeductionDetails = JSON.parse(
            this.paymentDetails_Server.ejDeductionDetails
          );
        }
        if (this.paymentDetails_Server.essFootagesDetails) {
          this.essfootagesDetails = JSON.parse(
            this.paymentDetails_Server.essFootagesDetails
          );
        }
        if (this.paymentDetails_Server.eSurDowntimeDetails) {
          this.esurdowntimeDetails = JSON.parse(
            this.paymentDetails_Server.eSurDowntimeDetails
          );
        }
        if (this.paymentDetails_Server.eSurNotInstalledDetails) {
          this.esurnotinstalledDetails = JSON.parse(
            this.paymentDetails_Server.eSurNotInstalledDetails
          );
        }
        if (this.paymentDetails_Server.craServicesDetails) {
          this.craservicesissuesDetails = JSON.parse(
            this.paymentDetails_Server.craServicesDetails
          );
        }
        if (this.paymentDetails_Server.robberyDetails) {
          this.robberyDetails = JSON.parse(
            this.paymentDetails_Server.robberyDetails
          );
        }
        if (this.paymentDetails_Server.cashMisappropriationDetails) {
          this.cashmisappropriationDetails = JSON.parse(
            this.paymentDetails_Server.cashMisappropriationDetails
          );
        }
        this.updateCategories();
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
    }
  }

  updateDifference(ind: number) {
    switch (ind) {
      case 1:
        {
          this.difference = (
            (this.paymentDetails_Server!.invoiceAmountWithGST || 0) -
            (this.paymentDetails!.invoiceAmountPaid || 0)
          ).toFixed(2);
        }
        break;
    }
  }

  updateTotal(ind: number) {
    switch (ind) {
      case 1:
        {
          this.cnDetails.cnTotal =
            (this.cnDetails.cnAmount || 0) +
            (this.cnDetails.cnCGST || 0) +
            (this.cnDetails.cnSGST || 0) +
            (this.cnDetails.cnIGST || 0) +
            (this.cnDetails.cnUGST || 0);
        }
        break;
      case 2:
        {
          this.dnDetails.dnTotal =
            (this.dnDetails.dnAmount || 0) +
            (this.dnDetails.dnCGST || 0) +
            (this.dnDetails.dnSGST || 0) +
            (this.dnDetails.dnIGST || 0) +
            (this.dnDetails.dnUGST || 0);
        }
        break;
      case 3:
        {
          this.withoutCNDetails.wcnTotal =
            (this.withoutCNDetails.wcnAmount || 0) +
            (this.withoutCNDetails.wcnCGST || 0) +
            (this.withoutCNDetails.wcnSGST || 0) +
            (this.withoutCNDetails.wcnIGST || 0) +
            (this.withoutCNDetails.wcnUGST || 0);
        }
        break;
      case 4:
        {
          this.tdsDetails.tdsTotal =
            (this.tdsDetails.tdsAmount || 0) +
            (this.tdsDetails.tdsCGST || 0) +
            (this.tdsDetails.tdsSGST || 0) +
            (this.tdsDetails.tdsIGST || 0) +
            (this.tdsDetails.tdsUGST || 0);
        }
        break;
      case 5:
        {
          this.gstTDSDetails.gstTDSTotal =
            (this.gstTDSDetails.gstTDSAmount || 0) +
            (this.gstTDSDetails.gstTDSCGST || 0) +
            (this.gstTDSDetails.gstTDSSGST || 0) +
            (this.gstTDSDetails.gstTDSIGST || 0) +
            (this.gstTDSDetails.gstTDSUGST || 0);
        }
        break;
      case 6:
        {
          this.remainingDetails.remainingTotal =
            (this.remainingDetails.remainingAmount || 0) +
            (this.remainingDetails.remainingCGST || 0) +
            (this.remainingDetails.remainingSGST || 0) +
            (this.remainingDetails.remainingIGST || 0) +
            (this.remainingDetails.remainingUGST || 0);
        }
        break;
      default:
        return;
        break;
    }
  }

  checkInvoiceTotal(): void {
    this.invoiceTotal =
      (this.cnDetails.cnTotal || 0) +
      (this.dnDetails.dnTotal || 0) +
      (this.withoutCNDetails.wcnTotal || 0) +
      (this.tdsDetails.tdsTotal || 0) +
      (this.gstTDSDetails.gstTDSTotal || 0);
    console.log('Difference: ', this.difference, 'Total: ', this.invoiceTotal);
  }

  checkCategoricalTotal(): void {
    this.categoricalTotal =
      (this.totalDetails.totalAmount || 0) +
      (this.totalDetails.totalCGST || 0) +
      (this.totalDetails.totalSGST || 0) +
      (this.totalDetails.totalIGST || 0) +
      (this.totalDetails.totalUGST || 0) +
      (this.totalDetails.totalCN || 0) +
      (this.totalDetails.totalWCN || 0) +
      (this.totalDetails.totalDN || 0) +
      (this.totalDetails.totalWDN || 0);
    this.difference = this.invoiceTotal - this.categoricalTotal;
  }

  updateCategoricalTotal(ind: number) {
    switch (ind) {
      case 1:
        {
          this.totalDetails.totalAmount =
            (this.fosDetails.fosAmount || 0) +
            (this.downtimeDetails.downtimeAmount || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyAmount || 0) +
            (this.housekeepingDetails.housekeepingAmount || 0) +
            (this.rejectbinDetails.rejectbinAmount || 0) +
            (this.consumableDetails.consumableAmount || 0) +
            (this.dosDetails.dosAmount || 0) +
            (this.excessbillingDetails.excessbillingAmount || 0) +
            (this.incentiveamountwithoutdnDetails
              .incentiveamountwithoutdnAmount || 0) +
            (this.reconpenaltyDetails.reconpenaltyAmount || 0) +
            (this.ejdeductionDetails.ejdeductionAmount || 0) +
            (this.essfootagesDetails.essfootagesAmount || 0) +
            (this.esurdowntimeDetails.esurdowntimeAmount || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledAmount || 0) +
            (this.craservicesissuesDetails.craservicesissuesAmount || 0) +
            (this.robberyDetails.robberyAmount || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationAmount || 0);
        }
        break;
      case 2:
        {
          this.totalDetails.totalCGST =
            (this.fosDetails.fosCGST || 0) +
            (this.downtimeDetails.downtimeCGST || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyCGST || 0) +
            (this.housekeepingDetails.housekeepingCGST || 0) +
            (this.rejectbinDetails.rejectbinCGST || 0) +
            (this.consumableDetails.consumableCGST || 0) +
            (this.dosDetails.dosCGST || 0) +
            (this.excessbillingDetails.excessbillingCGST || 0) +
            (this.incentiveamountwithoutdnDetails
              .incentiveamountwithoutdnCGST || 0) +
            (this.reconpenaltyDetails.reconpenaltyCGST || 0) +
            (this.ejdeductionDetails.ejdeductionCGST || 0) +
            (this.essfootagesDetails.essfootagesCGST || 0) +
            (this.esurdowntimeDetails.esurdowntimeCGST || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledCGST || 0) +
            (this.craservicesissuesDetails.craservicesissuesCGST || 0) +
            (this.robberyDetails.robberyCGST || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationCGST || 0);
        }
        break;
      case 3:
        {
          this.totalDetails.totalSGST =
            (this.fosDetails.fosSGST || 0) +
            (this.downtimeDetails.downtimeSGST || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltySGST || 0) +
            (this.housekeepingDetails.housekeepingSGST || 0) +
            (this.rejectbinDetails.rejectbinSGST || 0) +
            (this.consumableDetails.consumableSGST || 0) +
            (this.dosDetails.dosSGST || 0) +
            (this.excessbillingDetails.excessbillingSGST || 0) +
            (this.incentiveamountwithoutdnDetails
              .incentiveamountwithoutdnSGST || 0) +
            (this.reconpenaltyDetails.reconpenaltySGST || 0) +
            (this.ejdeductionDetails.ejdeductionSGST || 0) +
            (this.essfootagesDetails.essfootagesSGST || 0) +
            (this.esurdowntimeDetails.esurdowntimeSGST || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledSGST || 0) +
            (this.craservicesissuesDetails.craservicesissuesSGST || 0) +
            (this.robberyDetails.robberySGST || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationSGST || 0);
        }
        break;
      case 4:
        {
          this.totalDetails.totalIGST =
            (this.fosDetails.fosIGST || 0) +
            (this.downtimeDetails.downtimeIGST || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyIGST || 0) +
            (this.housekeepingDetails.housekeepingIGST || 0) +
            (this.rejectbinDetails.rejectbinIGST || 0) +
            (this.consumableDetails.consumableIGST || 0) +
            (this.dosDetails.dosIGST || 0) +
            (this.excessbillingDetails.excessbillingIGST || 0) +
            (this.incentiveamountwithoutdnDetails
              .incentiveamountwithoutdnIGST || 0) +
            (this.reconpenaltyDetails.reconpenaltyIGST || 0) +
            (this.ejdeductionDetails.ejdeductionIGST || 0) +
            (this.essfootagesDetails.essfootagesIGST || 0) +
            (this.esurdowntimeDetails.esurdowntimeIGST || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledIGST || 0) +
            (this.craservicesissuesDetails.craservicesissuesIGST || 0) +
            (this.robberyDetails.robberyIGST || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationIGST || 0);
        }
        break;
      case 5:
        {
          this.totalDetails.totalUGST =
            (this.fosDetails.fosUGST || 0) +
            (this.downtimeDetails.downtimeUGST || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyUGST || 0) +
            (this.housekeepingDetails.housekeepingUGST || 0) +
            (this.rejectbinDetails.rejectbinUGST || 0) +
            (this.consumableDetails.consumableUGST || 0) +
            (this.dosDetails.dosUGST || 0) +
            (this.excessbillingDetails.excessbillingUGST || 0) +
            (this.incentiveamountwithoutdnDetails
              .incentiveamountwithoutdnUGST || 0) +
            (this.reconpenaltyDetails.reconpenaltyUGST || 0) +
            (this.ejdeductionDetails.ejdeductionUGST || 0) +
            (this.essfootagesDetails.essfootagesUGST || 0) +
            (this.esurdowntimeDetails.esurdowntimeUGST || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledUGST || 0) +
            (this.craservicesissuesDetails.craservicesissuesUGST || 0) +
            (this.robberyDetails.robberyUGST || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationUGST || 0);
        }
        break;
      case 6:
        {
          this.totalDetails.totalCN =
            (this.fosDetails.fosCN || 0) +
            (this.downtimeDetails.downtimeCN || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyCN || 0) +
            (this.housekeepingDetails.housekeepingCN || 0) +
            (this.rejectbinDetails.rejectbinCN || 0) +
            (this.consumableDetails.consumableCN || 0) +
            (this.dosDetails.dosCN || 0) +
            (this.excessbillingDetails.excessbillingCN || 0) +
            (this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnCN ||
              0) +
            (this.reconpenaltyDetails.reconpenaltyCN || 0) +
            (this.ejdeductionDetails.ejdeductionCN || 0) +
            (this.essfootagesDetails.essfootagesCN || 0) +
            (this.esurdowntimeDetails.esurdowntimeCN || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledCN || 0) +
            (this.craservicesissuesDetails.craservicesissuesCN || 0) +
            (this.robberyDetails.robberyCN || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationCN || 0);
        }
        break;
      case 7:
        {
          this.totalDetails.totalWCN =
            (this.fosDetails.fosWCN || 0) +
            (this.downtimeDetails.downtimeWCN || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyWCN || 0) +
            (this.housekeepingDetails.housekeepingWCN || 0) +
            (this.rejectbinDetails.rejectbinWCN || 0) +
            (this.consumableDetails.consumableWCN || 0) +
            (this.dosDetails.dosWCN || 0) +
            (this.excessbillingDetails.excessbillingWCN || 0) +
            (this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnWCN ||
              0) +
            (this.reconpenaltyDetails.reconpenaltyWCN || 0) +
            (this.ejdeductionDetails.ejdeductionWCN || 0) +
            (this.essfootagesDetails.essfootagesWCN || 0) +
            (this.esurdowntimeDetails.esurdowntimeWCN || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledWCN || 0) +
            (this.craservicesissuesDetails.craservicesissuesWCN || 0) +
            (this.robberyDetails.robberyWCN || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationWCN || 0);
        }
        break;
      case 8:
        {
          this.totalDetails.totalDN =
            (this.fosDetails.fosDN || 0) +
            (this.downtimeDetails.downtimeDN || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyDN || 0) +
            (this.housekeepingDetails.housekeepingDN || 0) +
            (this.rejectbinDetails.rejectbinDN || 0) +
            (this.consumableDetails.consumableDN || 0) +
            (this.dosDetails.dosDN || 0) +
            (this.excessbillingDetails.excessbillingDN || 0) +
            (this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnDN ||
              0) +
            (this.reconpenaltyDetails.reconpenaltyDN || 0) +
            (this.ejdeductionDetails.ejdeductionDN || 0) +
            (this.essfootagesDetails.essfootagesDN || 0) +
            (this.esurdowntimeDetails.esurdowntimeDN || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledDN || 0) +
            (this.craservicesissuesDetails.craservicesissuesDN || 0) +
            (this.robberyDetails.robberyDN || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationDN || 0);
        }
        break;
      case 9:
        {
          this.totalDetails.totalWDN =
            (this.fosDetails.fosWDN || 0) +
            (this.downtimeDetails.downtimeWDN || 0) +
            (this.cashoutpenaltyDetails.cashoutpenaltyWDN || 0) +
            (this.housekeepingDetails.housekeepingWDN || 0) +
            (this.rejectbinDetails.rejectbinWDN || 0) +
            (this.consumableDetails.consumableWDN || 0) +
            (this.dosDetails.dosWDN || 0) +
            (this.excessbillingDetails.excessbillingWDN || 0) +
            (this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnWDN ||
              0) +
            (this.reconpenaltyDetails.reconpenaltyWDN || 0) +
            (this.ejdeductionDetails.ejdeductionWDN || 0) +
            (this.essfootagesDetails.essfootagesWDN || 0) +
            (this.esurdowntimeDetails.esurdowntimeWDN || 0) +
            (this.esurnotinstalledDetails.esurnotinstalledWDN || 0) +
            (this.craservicesissuesDetails.craservicesissuesWDN || 0) +
            (this.robberyDetails.robberyWDN || 0) +
            (this.cashmisappropriationDetails.cashmisappropriationWDN || 0);
        }
        break;
    }
  }

  downloadInvoice() {
    const table1 = {
      name: `Summary for Invoice No #${this.paymentDetails_Server?.invoiceNo}`,
      data: [
        {
          description: 'Invoice Amount',
          details: this.paymentDetails_Server?.invoiceAmount,
        },
        {
          description: 'Invoice Amount with GST',
          details: this.paymentDetails_Server?.invoiceAmountWithGST,
        },
        {
          description: 'Invoice Amount Paid',
          details: this.paymentDetails?.invoiceAmountPaid,
        },
        {
          description: 'Remaining / Difference',
          details: this.difference,
        },
        {
          description: 'Invoice Amount Paid Date',
          details: this.paymentDetails_Server?.invoiceAmountPaidDate,
        },
      ],
      columns: ['Description', 'Details'],
    };

    const table2 = {
      name: 'Invoice Details',
      data: [
        {
          details: 'CN Amount',
          amount: this.cnDetails.cnAmount || '',
          cgst: this.cnDetails.cnCGST || '',
          sgst: this.cnDetails.cnSGST || '',
          igst: this.cnDetails.cnIGST || '',
          ugst: this.cnDetails.cnUGST || '',
          total: this.cnDetails.cnTotal || '',
        },
        {
          details: 'Incentive DN Amount',
          amount: this.dnDetails.dnAmount || '',
          cgst: this.dnDetails.dnCGST || '',
          sgst: this.dnDetails.dnSGST || '',
          igst: this.dnDetails.dnIGST || '',
          ugst: this.dnDetails.dnUGST || '',
          total: this.dnDetails.dnTotal || '',
        },
        {
          details: 'Without CN Amount',
          amount: this.withoutCNDetails.wcnAmount || '',
          cgst: this.withoutCNDetails.wcnCGST || '',
          sgst: this.withoutCNDetails.wcnSGST || '',
          igst: this.withoutCNDetails.wcnIGST || '',
          ugst: this.withoutCNDetails.wcnUGST || '',
          total: this.withoutCNDetails.wcnTotal || '',
        },
        {
          details: 'TDS',
          amount: this.tdsDetails.tdsAmount || '',
          cgst: this.tdsDetails.tdsCGST || '',
          sgst: this.tdsDetails.tdsSGST || '',
          igst: this.tdsDetails.tdsIGST || '',
          ugst: this.tdsDetails.tdsUGST || '',
          total: this.tdsDetails.tdsTotal || '',
        },
        {
          details: 'GST TDS',
          amount: this.gstTDSDetails.gstTDSAmount || '',
          cgst: this.gstTDSDetails.gstTDSCGST || '',
          sgst: this.gstTDSDetails.gstTDSSGST || '',
          igst: this.gstTDSDetails.gstTDSIGST || '',
          ugst: this.gstTDSDetails.gstTDSUGST || '',
          total: this.gstTDSDetails.gstTDSTotal || '',
        },
        {
          details: 'Remaining/Difference',
          amount: this.remainingDetails.remainingAmount || '',
          cgst: this.remainingDetails.remainingCGST || '',
          sgst: this.remainingDetails.remainingSGST || '',
          igst: this.remainingDetails.remainingIGST || '',
          ugst: this.remainingDetails.remainingUGST || '',
          total: this.remainingDetails.remainingTotal || '',
        },
      ],
      columns: [
        'Details',
        'Amount',
        'C GST',
        'S GST',
        'I GST',
        'U GST',
        'Total',
      ],
    };

    const table3 = {
      name: 'Categorical Details',
      data: [
        {
          category: 'FOS',
          amount: this.fosDetails.fosAmount,
          cgst: this.fosDetails.fosCGST,
          sgst: this.fosDetails.fosSGST,
          igst: this.fosDetails.fosIGST,
          ugst: this.fosDetails.fosUGST,
          cn: this.fosDetails.fosCN,
          wcn: this.fosDetails.fosWCN,
          dn: this.fosDetails.fosDN,
          wdn: this.fosDetails.fosWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Down Time',
          amount: this.downtimeDetails.downtimeAmount,
          cgst: this.downtimeDetails.downtimeCGST,
          sgst: this.downtimeDetails.downtimeSGST,
          igst: this.downtimeDetails.downtimeIGST,
          ugst: this.downtimeDetails.downtimeUGST,
          cn: this.downtimeDetails.downtimeCN,
          wcn: this.downtimeDetails.downtimeWCN,
          dn: this.downtimeDetails.downtimeDN,
          wdn: this.downtimeDetails.downtimeWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Cash Out Penalty',
          amount: this.cashoutpenaltyDetails.cashoutpenaltyAmount,
          cgst: this.cashoutpenaltyDetails.cashoutpenaltyCGST,
          sgst: this.cashoutpenaltyDetails.cashoutpenaltySGST,
          igst: this.cashoutpenaltyDetails.cashoutpenaltyIGST,
          ugst: this.cashoutpenaltyDetails.cashoutpenaltyUGST,
          cn: this.cashoutpenaltyDetails.cashoutpenaltyCN,
          wcn: this.cashoutpenaltyDetails.cashoutpenaltyWCN,
          dn: this.cashoutpenaltyDetails.cashoutpenaltyDN,
          wdn: this.cashoutpenaltyDetails.cashoutpenaltyWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'House Keeping',
          amount: this.housekeepingDetails.housekeepingAmount,
          cgst: this.housekeepingDetails.housekeepingCGST,
          sgst: this.housekeepingDetails.housekeepingSGST,
          igst: this.housekeepingDetails.housekeepingIGST,
          ugst: this.housekeepingDetails.housekeepingUGST,
          cn: this.housekeepingDetails.housekeepingCN,
          wcn: this.housekeepingDetails.housekeepingWCN,
          dn: this.housekeepingDetails.housekeepingDN,
          wdn: this.housekeepingDetails.housekeepingWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Reject Bin',
          amount: this.rejectbinDetails.rejectbinAmount,
          cgst: this.rejectbinDetails.rejectbinCGST,
          sgst: this.rejectbinDetails.rejectbinSGST,
          igst: this.rejectbinDetails.rejectbinIGST,
          ugst: this.rejectbinDetails.rejectbinUGST,
          cn: this.rejectbinDetails.rejectbinCN,
          wcn: this.rejectbinDetails.rejectbinWCN,
          dn: this.rejectbinDetails.rejectbinDN,
          wdn: this.rejectbinDetails.rejectbinWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Consumable',
          amount: this.consumableDetails.consumableAmount,
          cgst: this.consumableDetails.consumableCGST,
          sgst: this.consumableDetails.consumableSGST,
          igst: this.consumableDetails.consumableIGST,
          ugst: this.consumableDetails.consumableUGST,
          cn: this.consumableDetails.consumableCN,
          wcn: this.consumableDetails.consumableWCN,
          dn: this.consumableDetails.consumableDN,
          wdn: this.consumableDetails.consumableWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'DOS',
          amount: this.dosDetails.dosAmount,
          cgst: this.dosDetails.dosCGST,
          sgst: this.dosDetails.dosSGST,
          igst: this.dosDetails.dosIGST,
          ugst: this.dosDetails.dosUGST,
          cn: this.dosDetails.dosCN,
          wcn: this.dosDetails.dosWCN,
          dn: this.dosDetails.dosDN,
          wdn: this.dosDetails.dosWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Excess Billing',
          amount: this.excessbillingDetails.excessbillingAmount,
          cgst: this.excessbillingDetails.excessbillingCGST,
          sgst: this.excessbillingDetails.excessbillingSGST,
          igst: this.excessbillingDetails.excessbillingIGST,
          ugst: this.excessbillingDetails.excessbillingUGST,
          cn: this.excessbillingDetails.excessbillingCN,
          wcn: this.excessbillingDetails.excessbillingWCN,
          dn: this.excessbillingDetails.excessbillingDN,
          wdn: this.excessbillingDetails.excessbillingWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Incentive Amount Without DN',
          amount:
            this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnAmount,
          cgst: this.incentiveamountwithoutdnDetails
            .incentiveamountwithoutdnCGST,
          sgst: this.incentiveamountwithoutdnDetails
            .incentiveamountwithoutdnSGST,
          igst: this.incentiveamountwithoutdnDetails
            .incentiveamountwithoutdnIGST,
          ugst: this.incentiveamountwithoutdnDetails
            .incentiveamountwithoutdnUGST,
          cn: this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnCN,
          wcn: this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnWCN,
          dn: this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnDN,
          wdn: this.incentiveamountwithoutdnDetails.incentiveamountwithoutdnWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Recon Penalty',
          amount: this.reconpenaltyDetails.reconpenaltyAmount,
          cgst: this.reconpenaltyDetails.reconpenaltyCGST,
          sgst: this.reconpenaltyDetails.reconpenaltySGST,
          igst: this.reconpenaltyDetails.reconpenaltyIGST,
          ugst: this.reconpenaltyDetails.reconpenaltyUGST,
          cn: this.reconpenaltyDetails.reconpenaltyCN,
          wcn: this.reconpenaltyDetails.reconpenaltyWCN,
          dn: this.reconpenaltyDetails.reconpenaltyDN,
          wdn: this.reconpenaltyDetails.reconpenaltyWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'EJ Deduction',
          amount: this.ejdeductionDetails.ejdeductionAmount,
          cgst: this.ejdeductionDetails.ejdeductionCGST,
          sgst: this.ejdeductionDetails.ejdeductionSGST,
          igst: this.ejdeductionDetails.ejdeductionIGST,
          ugst: this.ejdeductionDetails.ejdeductionUGST,
          cn: this.ejdeductionDetails.ejdeductionCN,
          wcn: this.ejdeductionDetails.ejdeductionWCN,
          dn: this.ejdeductionDetails.ejdeductionDN,
          wdn: this.ejdeductionDetails.ejdeductionWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'ESS Footages',
          amount: this.essfootagesDetails.essfootagesAmount,
          cgst: this.essfootagesDetails.essfootagesCGST,
          sgst: this.essfootagesDetails.essfootagesSGST,
          igst: this.essfootagesDetails.essfootagesIGST,
          ugst: this.essfootagesDetails.essfootagesUGST,
          cn: this.essfootagesDetails.essfootagesCN,
          wcn: this.essfootagesDetails.essfootagesWCN,
          dn: this.essfootagesDetails.essfootagesDN,
          wdn: this.essfootagesDetails.essfootagesWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'E-Sur Downtime',
          amount: this.esurdowntimeDetails.esurdowntimeAmount,
          cgst: this.esurdowntimeDetails.esurdowntimeCGST,
          sgst: this.esurdowntimeDetails.esurdowntimeSGST,
          igst: this.esurdowntimeDetails.esurdowntimeIGST,
          ugst: this.esurdowntimeDetails.esurdowntimeUGST,
          cn: this.esurdowntimeDetails.esurdowntimeCN,
          wcn: this.esurdowntimeDetails.esurdowntimeWCN,
          dn: this.esurdowntimeDetails.esurdowntimeDN,
          wdn: this.esurdowntimeDetails.esurdowntimeWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'E-Sur Not Installed',
          amount: this.esurnotinstalledDetails.esurnotinstalledAmount,
          cgst: this.esurnotinstalledDetails.esurnotinstalledCGST,
          sgst: this.esurnotinstalledDetails.esurnotinstalledSGST,
          igst: this.esurnotinstalledDetails.esurnotinstalledIGST,
          ugst: this.esurnotinstalledDetails.esurnotinstalledUGST,
          cn: this.esurnotinstalledDetails.esurnotinstalledCN,
          wcn: this.esurnotinstalledDetails.esurnotinstalledWCN,
          dn: this.esurnotinstalledDetails.esurnotinstalledDN,
          wdn: this.esurnotinstalledDetails.esurnotinstalledWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'CRA Services Issues',
          amount: this.craservicesissuesDetails.craservicesissuesAmount,
          cgst: this.craservicesissuesDetails.craservicesissuesCGST,
          sgst: this.craservicesissuesDetails.craservicesissuesSGST,
          igst: this.craservicesissuesDetails.craservicesissuesIGST,
          ugst: this.craservicesissuesDetails.craservicesissuesUGST,
          cn: this.craservicesissuesDetails.craservicesissuesCN,
          wcn: this.craservicesissuesDetails.craservicesissuesWCN,
          dn: this.craservicesissuesDetails.craservicesissuesDN,
          wdn: this.craservicesissuesDetails.craservicesissuesWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Robbery / Theft',
          amount: this.robberyDetails.robberyAmount,
          cgst: this.robberyDetails.robberyCGST,
          sgst: this.robberyDetails.robberySGST,
          igst: this.robberyDetails.robberyIGST,
          ugst: this.robberyDetails.robberyUGST,
          cn: this.robberyDetails.robberyCN,
          wcn: this.robberyDetails.robberyWCN,
          dn: this.robberyDetails.robberyDN,
          wdn: this.robberyDetails.robberyWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Cash Misappropriation',
          amount: this.cashmisappropriationDetails.cashmisappropriationAmount,
          cgst: this.cashmisappropriationDetails.cashmisappropriationCGST,
          sgst: this.cashmisappropriationDetails.cashmisappropriationSGST,
          igst: this.cashmisappropriationDetails.cashmisappropriationIGST,
          ugst: this.cashmisappropriationDetails.cashmisappropriationUGST,
          cn: this.cashmisappropriationDetails.cashmisappropriationCN,
          wcn: this.cashmisappropriationDetails.cashmisappropriationWCN,
          dn: this.cashmisappropriationDetails.cashmisappropriationDN,
          wdn: this.cashmisappropriationDetails.cashmisappropriationWDN,
          document: '#Attachment File Link',
        },
        {
          category: 'Total',
          amount: this.totalDetails.totalAmount,
          cgst: this.totalDetails.totalCGST,
          sgst: this.totalDetails.totalSGST,
          igst: this.totalDetails.totalIGST,
          ugst: this.totalDetails.totalUGST,
          cn: this.totalDetails.totalCN,
          wcn: this.totalDetails.totalWCN,
          dn: this.totalDetails.totalDN,
          wdn: this.totalDetails.totalWDN,
          document: '#Attachment File Link',
        },
      ],
      columns: [
        'Category',
        'Amount',
        'C GST',
        'S GST',
        'I GST',
        'U GST',
        'CN',
        'Without CN',
        'DN',
        'Without DN',
        'Document',
      ],
    };

    this.excelService.exportToExcel(
      [table1, table2, table3],
      `Invoice_${
        this.paymentDetails_Server?.invoiceNo
      }_${new Date().toISOString()}`
    );
  }
}
