import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianNumber',
})
export class IndianNumberPipe implements PipeTransform {
  transform(
    value: number | string | undefined,
    currency: boolean = false,
    decimalPlaces: string = '1.2-2'
  ): string {
    if (value === null || value === undefined) return '';

    let numStr = value.toString();
    let [integerPart, decimalPart] = numStr.split('.');

    let lastThree = integerPart.substring(integerPart.length - 3);
    let otherNumbers = integerPart.substring(0, integerPart.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    let formattedIntegerPart =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

    if (decimalPart) {
      let decimalFormatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: parseInt(
          decimalPlaces.split('.')[1].split('-')[0]
        ),
        maximumFractionDigits: parseInt(
          decimalPlaces.split('.')[1].split('-')[1]
        ),
      });
      decimalPart = decimalFormatter
        .format(parseFloat('0.' + decimalPart))
        .split('.')[1];
      formattedIntegerPart += '.' + decimalPart;
    }

    return currency ? '₹ ' + formattedIntegerPart : formattedIntegerPart;
  }
}
