import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  exportToExcel(
    tables: { name: string; data: any[]; columns: string[] }[],
    fileName: string
  ): void {
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]); // Create an empty worksheet

    tables.forEach((table) => {
      // Add table name as header
      XLSX.utils.sheet_add_aoa(worksheet, [[table.name]], { origin: -1 }); // Append at the end

      // Add column headers
      XLSX.utils.sheet_add_aoa(worksheet, [table.columns], { origin: -1 }); // Append at the end

      // Add table data
      XLSX.utils.sheet_add_json(worksheet, table.data, {
        skipHeader: true,
        origin: -1,
      }); // Append at the end

      XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: -1 });
    });

    const columnWidths = Array.from(
      { length: tables[0].columns.length },
      () => ({ width: 30 })
    ); // Set width to 100 (adjust as needed)
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    workbook.Sheets['Sheet1'] = worksheet;
    workbook.SheetNames.push('Sheet1');

    // Convert workbook to binary Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save as Excel file
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = fileName + '.xlsx';
    a.click();
  }
}
