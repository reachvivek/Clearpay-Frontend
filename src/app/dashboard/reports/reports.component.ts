import { Component } from '@angular/core';
import { InvoiceService } from '../../../swagger';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IndianNumberPipe } from '../../pipes/indian-number.pipe';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  reports: any = [];

  cols!: Column[];

  exportFileName: string = `InvoiceReport_${this.formatDate(new Date())}.csv`;

  constructor(
    private reportService: InvoiceService,
    private datePipe: DatePipe,
    private indianCurrencyPipe: IndianNumberPipe
  ) {}

  async ngOnInit() {
    await this.loadReports();
    this.cols = [
      { field: 'dateOfSubmission', header: 'Date of Submission' },
      { field: 'invoiceNo', header: 'Invoice No' },
      { field: 'bankName', header: 'Customer' },
      { field: 'invoiceMonth', header: 'Service Month' },
      { field: 'invoiceYear', header: 'Financial Year' },
      { field: 'serviceType', header: 'Service Type' },
      { field: 'invoiceAmountPaid', header: 'Invoice Amount Paid' },
      { field: 'invoiceGst', header: 'GST' },
      { field: 'cnTotal', header: 'Credit Note' },
      { field: 'dnTotal', header: 'Debit Note' },
      { field: 'tdsTotal', header: 'TDS' },
      { field: 'gstTdsTotal', header: 'GST TDS' },
      { field: 'fosTotal', header: 'FOS' },
      { field: 'downtimeTotal', header: 'Downtime' },
      { field: 'cashoutpenaltyTotal', header: 'Cash Out Penalty' },
      { field: 'housekeepingTotal', header: 'House Keeping' },
      { field: 'rejectbinTotal', header: 'Reject Bin' },
      { field: 'consumableTotal', header: 'Consumable' },
      { field: 'dosTotal', header: 'DOS' },
      { field: 'excessbillingTotal', header: 'Excess Billing' },
      {
        field: 'incentiveamountwithoutdnTotal',
        header: 'Incentive Amount Without DN',
      },
      { field: 'reconpenaltyTotal', header: 'Recon Penalty' },
      { field: 'ejdeductionTotal', header: 'EJ Deduction' },
      { field: 'essfootagesTotal', header: 'ESS Footages' },
      { field: 'esurdowntimeTotal', header: 'E-Sur Downtime' },
      { field: 'esurnotinstalledTotal', header: 'E-Sur Not Installed' },
      { field: 'craservicesTotal', header: 'CRA Services Issues' },
      { field: 'robberyTotal', header: 'Robbery/Theft' },
      { field: 'cashmisappropriationTotal', header: 'Cash Misappropriation' },
      { field: 'adjustedAmount', header: 'Adjusted Amount' },
    ];
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    // Use toLocaleDateString to format the date as MM-DD-YYYY
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-'); // Change slashes to dashes for the filename
  }

  async loadReports() {
    try {
      const res = await firstValueFrom(
        this.reportService.invoiceGetReportsGet()
      );
      if (res) {
        this.reports = res;
        this.reports.forEach((entry: any) => {
          try {
            entry.invoiceGst = entry.invoiceAmountWithGST - entry.invoiceAmount;
            const cnDetails = JSON.parse(entry.cnDetails);
            const dnDetails = JSON.parse(entry.incentiveDNDetails);
            entry.cnTotal = cnDetails.cnAmount;
            entry.dnTotal = dnDetails.dnTotal;
            const tdsDetails = JSON.parse(entry.tdsDetails);
            entry.tdsTotal =
              (tdsDetails.tdsAmount || 0) +
              (tdsDetails.tdsCGST || 0) +
              (tdsDetails.tdsSGST || 0) +
              (tdsDetails.tdsIGST || 0) +
              (tdsDetails.tdsUGST || 0);
            const gstTDSDetails = JSON.parse(entry.gsttdsDetails);
            entry.gstTdsTotal =
              (gstTDSDetails.gstTDSAmount || 0) +
              (gstTDSDetails.gstTDSCGST || 0) +
              (gstTDSDetails.gstTDSSGST || 0) +
              (gstTDSDetails.gstTDSIGST || 0) +
              (gstTDSDetails.gstTDSUGST || 0);
            const fosDetails = JSON.parse(entry.fosDetails);
            entry.fosTotal =
              (fosDetails.fosAmount || 0) +
              (fosDetails.fosCGST || 0) +
              (fosDetails.fosSGST || 0) +
              (fosDetails.fosIGST || 0) +
              (fosDetails.fosUGST || 0) +
              (fosDetails.fosCN || 0) +
              (fosDetails.fosWCN || 0) +
              (fosDetails.fosDN || 0) +
              (fosDetails.fosWDN || 0);
            const downtimeDetails = JSON.parse(entry.downtimeDetails);
            entry.downtimeTotal =
              (downtimeDetails.downtimeAmount || 0) +
              (downtimeDetails.downtimeCGST || 0) +
              (downtimeDetails.downtimeSGST || 0) +
              (downtimeDetails.downtimeIGST || 0) +
              (downtimeDetails.downtimeUGST || 0) +
              (downtimeDetails.downtimeCN || 0) +
              (downtimeDetails.downtimeWCN || 0) +
              (downtimeDetails.downtimeDN || 0) +
              (downtimeDetails.downtimeWDN || 0);
            const cashoutpenaltyDetails = JSON.parse(
              entry.cashOutPenaltyDetails
            );
            entry.cashoutpenaltyTotal =
              (cashoutpenaltyDetails.cashoutpenaltyAmount || 0) +
              (cashoutpenaltyDetails.cashoutpenaltyCGST || 0) +
              (cashoutpenaltyDetails.cashoutpenaltySGST || 0) +
              (cashoutpenaltyDetails.cashoutpenaltyIGST || 0) +
              (cashoutpenaltyDetails.cashoutpenaltyUGST || 0) +
              (cashoutpenaltyDetails.cashoutpenaltyCN || 0) +
              (cashoutpenaltyDetails.cashoutpenaltyWCN || 0) +
              (cashoutpenaltyDetails.cashoutpenaltyDN || 0) +
              (cashoutpenaltyDetails.cashoutpenaltyWDN || 0);
            const housekeepingDetails = JSON.parse(entry.houseKeepingDetails);
            entry.housekeepingTotal =
              (housekeepingDetails.housekeepingAmount || 0) +
              (housekeepingDetails.housekeepingCGST || 0) +
              (housekeepingDetails.housekeepingSGST || 0) +
              (housekeepingDetails.housekeepingIGST || 0) +
              (housekeepingDetails.housekeepingUGST || 0) +
              (housekeepingDetails.housekeepingCN || 0) +
              (housekeepingDetails.housekeepingWCN || 0) +
              (housekeepingDetails.housekeepingDN || 0) +
              (housekeepingDetails.housekeepingWDN || 0);
            const rejectbinDetails = JSON.parse(entry.rejectBinDetails);
            entry.rejectbinTotal =
              (rejectbinDetails.rejectbinAmount || 0) +
              (rejectbinDetails.rejectbinCGST || 0) +
              (rejectbinDetails.rejectbinSGST || 0) +
              (rejectbinDetails.rejectbinIGST || 0) +
              (rejectbinDetails.rejectbinUGST || 0) +
              (rejectbinDetails.rejectbinCN || 0) +
              (rejectbinDetails.rejectbinWCN || 0) +
              (rejectbinDetails.rejectbinDN || 0) +
              (rejectbinDetails.rejectbinWDN || 0);
            const consumableDetails = JSON.parse(entry.consumableDetails);
            entry.consumableTotal =
              (consumableDetails.consumableAmount || 0) +
              (consumableDetails.consumableCGST || 0) +
              (consumableDetails.consumableSGST || 0) +
              (consumableDetails.consumableIGST || 0) +
              (consumableDetails.consumableUGST || 0) +
              (consumableDetails.consumableCN || 0) +
              (consumableDetails.consumableWCN || 0) +
              (consumableDetails.consumableDN || 0) +
              (consumableDetails.consumableWDN || 0);

            const dosDetails = JSON.parse(entry.dosDetails);
            entry.dosTotal =
              (dosDetails.dosAmount || 0) +
              (dosDetails.dosCGST || 0) +
              (dosDetails.dosSGST || 0) +
              (dosDetails.dosIGST || 0) +
              (dosDetails.dosUGST || 0) +
              (dosDetails.dosCN || 0) +
              (dosDetails.dosWCN || 0) +
              (dosDetails.dosDN || 0) +
              (dosDetails.dosWDN || 0);

            const excessbillingDetails = JSON.parse(entry.excessBillingDetails);
            entry.excessbillingTotal =
              (excessbillingDetails.excessbillingAmount || 0) +
              (excessbillingDetails.excessbillingCGST || 0) +
              (excessbillingDetails.excessbillingSGST || 0) +
              (excessbillingDetails.excessbillingIGST || 0) +
              (excessbillingDetails.excessbillingUGST || 0) +
              (excessbillingDetails.excessbillingCN || 0) +
              (excessbillingDetails.excessbillingWCN || 0) +
              (excessbillingDetails.excessbillingDN || 0) +
              (excessbillingDetails.excessbillingWDN || 0);
            const incentiveamountwithoutdnDetails = JSON.parse(
              entry.incentiveAmountWithoutDNDetails
            );
            entry.incentiveamountwithoutdnTotal =
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnAmount ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnCGST ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnSGST ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnIGST ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnUGST ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnCN ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnWCN ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnDN ||
                0) +
              (incentiveamountwithoutdnDetails.incentiveamountwithoutdnWDN ||
                0);

            const reconpenaltyDetails = JSON.parse(entry.reconPenaltyDetails);
            entry.reconpenaltyTotal =
              (reconpenaltyDetails.reconpenaltyAmount || 0) +
              (reconpenaltyDetails.reconpenaltyCGST || 0) +
              (reconpenaltyDetails.reconpenaltySGST || 0) +
              (reconpenaltyDetails.reconpenaltyIGST || 0) +
              (reconpenaltyDetails.reconpenaltyUGST || 0) +
              (reconpenaltyDetails.reconpenaltyCN || 0) +
              (reconpenaltyDetails.reconpenaltyWCN || 0) +
              (reconpenaltyDetails.reconpenaltyDN || 0) +
              (reconpenaltyDetails.reconpenaltyWDN || 0);

            const ejdeductionDetails = JSON.parse(entry.ejDeductionDetails);
            entry.ejdeductionTotal =
              (ejdeductionDetails.ejdeductionAmount || 0) +
              (ejdeductionDetails.ejdeductionCGST || 0) +
              (ejdeductionDetails.ejdeductionSGST || 0) +
              (ejdeductionDetails.ejdeductionIGST || 0) +
              (ejdeductionDetails.ejdeductionUGST || 0) +
              (ejdeductionDetails.ejdeductionCN || 0) +
              (ejdeductionDetails.ejdeductionWCN || 0) +
              (ejdeductionDetails.ejdeductionDN || 0) +
              (ejdeductionDetails.ejdeductionWDN || 0);

            const essfootagesDetails = JSON.parse(entry.essFootagesDetails);
            entry.essfootagesTotal =
              (essfootagesDetails.essfootagesAmount || 0) +
              (essfootagesDetails.essfootagesCGST || 0) +
              (essfootagesDetails.essfootagesSGST || 0) +
              (essfootagesDetails.essfootagesIGST || 0) +
              (essfootagesDetails.essfootagesUGST || 0) +
              (essfootagesDetails.essfootagesCN || 0) +
              (essfootagesDetails.essfootagesWCN || 0) +
              (essfootagesDetails.essfootagesDN || 0) +
              (essfootagesDetails.essfootagesWDN || 0);

            const esurdowntimeDetails = JSON.parse(entry.eSurDowntimeDetails);
            entry.esurdowntimeTotal =
              (esurdowntimeDetails.esurdowntimeAmount || 0) +
              (esurdowntimeDetails.esurdowntimeCGST || 0) +
              (esurdowntimeDetails.esurdowntimeSGST || 0) +
              (esurdowntimeDetails.esurdowntimeIGST || 0) +
              (esurdowntimeDetails.esurdowntimeUGST || 0) +
              (esurdowntimeDetails.esurdowntimeCN || 0) +
              (esurdowntimeDetails.esurdowntimeWCN || 0) +
              (esurdowntimeDetails.esurdowntimeDN || 0) +
              (esurdowntimeDetails.esurdowntimeWDN || 0);

            const esurnotinstalledDetails = JSON.parse(
              entry.eSurNotInstalledDetails
            );
            entry.esurnotinstalledTotal =
              (esurnotinstalledDetails.esurnotinstalledAmount || 0) +
              (esurnotinstalledDetails.esurnotinstalledCGST || 0) +
              (esurnotinstalledDetails.esurnotinstalledSGST || 0) +
              (esurnotinstalledDetails.esurnotinstalledIGST || 0) +
              (esurnotinstalledDetails.esurnotinstalledUGST || 0) +
              (esurnotinstalledDetails.esurnotinstalledCN || 0) +
              (esurnotinstalledDetails.esurnotinstalledWCN || 0) +
              (esurnotinstalledDetails.esurnotinstalledDN || 0) +
              (esurnotinstalledDetails.esurnotinstalledWDN || 0);

            const craservicesDetails = JSON.parse(entry.craServicesDetails);
            entry.craservicesTotal =
              (craservicesDetails.craservicesissuesAmount || 0) +
              (craservicesDetails.craservicesissuesCGST || 0) +
              (craservicesDetails.craservicesissuesSGST || 0) +
              (craservicesDetails.craservicesissuesIGST || 0) +
              (craservicesDetails.craservicesissuesUGST || 0) +
              (craservicesDetails.craservicesissuesCN || 0) +
              (craservicesDetails.craservicesissuesWCN || 0) +
              (craservicesDetails.craservicesissuesDN || 0) +
              (craservicesDetails.craservicesissuesWDN || 0);

            const robberyDetails = JSON.parse(entry.robberyDetails);
            entry.robberyTotal =
              (robberyDetails.robberyAmount || 0) +
              (robberyDetails.robberyCGST || 0) +
              (robberyDetails.robberySGST || 0) +
              (robberyDetails.robberyIGST || 0) +
              (robberyDetails.robberyUGST || 0) +
              (robberyDetails.robberyCN || 0) +
              (robberyDetails.robberyWCN || 0) +
              (robberyDetails.robberyDN || 0) +
              (robberyDetails.robberyWDN || 0);

            const cashmisappropriationDetails = JSON.parse(
              entry.cashMisappropriationDetails
            );
            entry.cashmisappropriationTotal =
              (cashmisappropriationDetails.cashmisappropriationAmount || 0) +
              (cashmisappropriationDetails.cashmisappropriationCGST || 0) +
              (cashmisappropriationDetails.cashmisappropriationSGST || 0) +
              (cashmisappropriationDetails.cashmisappropriationIGST || 0) +
              (cashmisappropriationDetails.cashmisappropriationUGST || 0) +
              (cashmisappropriationDetails.cashmisappropriationCN || 0) +
              (cashmisappropriationDetails.cashmisappropriationWCN || 0) +
              (cashmisappropriationDetails.cashmisappropriationDN || 0) +
              (cashmisappropriationDetails.cashmisappropriationWDN || 0);
          } catch (error: any) {
            // console.error(`Error parsing JSON for entry: ${entry}`, error);
          }
        });
      }
    } catch (err: any) {
      console.log(err);
    }
  }

  exportToCSV() {
    const data = this.reports;

    const headers = this.cols.map((col) => col.header);
    const rows = data.map((bill: any) =>
      [
        this.escapeCsvField(
          this.datePipe.transform(bill.dateOfSubmission, 'dd-MMM-yyyy') || ''
        ),
        this.escapeCsvField(bill.invoiceNo),
        this.escapeCsvField(bill.bankName),
        this.escapeCsvField(bill.invoiceMonth),
        this.escapeCsvField(bill.invoiceYear),
        this.escapeCsvField(bill.serviceType),
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.invoiceAmountPaid || 0, true)
        ), // Ensure no extra spaces
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.invoiceGst || 0, true)
        ), // Ensure no extra spaces
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.cnTotal || 0, true)
        ), // Credit Note
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.dnTotal || 0, true)
        ), // Debit Note
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.tdsTotal || 0, true)
        ), // TDS
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.gstTdsTotal || 0, true)
        ), // GST TDS
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.fosTotal || 0, true)
        ), // FOS
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.downtimeTotal || 0, true)
        ), // Downtime
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.cashoutpenaltyTotal || 0, true)
        ), // Cash Out Penalty
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.housekeepingTotal || 0, true)
        ), // House Keeping
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.rejectbinTotal || 0, true)
        ), // Reject Bin
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.consumableTotal || 0, true)
        ), // Consumable
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.dosTotal || 0, true)
        ), // DOS
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.excessbillingTotal || 0, true)
        ), // Excess Billing
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(
            bill.incentiveamountwithoutdnTotal || 0,
            true
          )
        ), // Incentive Amount Without DN
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.reconpenaltyTotal || 0, true)
        ), // Recon Penalty
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.ejdeductionTotal || 0, true)
        ), // EJ Deduction
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.essfootagesTotal || 0, true)
        ), // ESS Footages
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.esurdowntimeTotal || 0, true)
        ), // E-Sur Downtime
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(
            bill.esurnotinstalledTotal || 0,
            true
          )
        ), // E-Sur Not Installed
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.craservicesTotal || 0, true)
        ), // CRA Services Issues
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.robberyTotal || 0, true)
        ), // Robbery/Theft
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(
            bill.cashmisappropriationTotal || 0,
            true
          )
        ), // Cash Misappropriation
        this.escapeCsvField(
          this.indianCurrencyPipe.transform(bill.adjustedAmount || 0, true)
        ), // Adjusted Amount
      ].join(',')
    );

    const csvData = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([`\ufeff${csvData}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', this.exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  escapeCsvField(value: any) {
    if (typeof value === 'string') {
      value = value.replace(/"/g, '""'); // Escape double quotes
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value}"`; // Wrap in quotes if necessary
      }
    }
    return value;
  }
}
