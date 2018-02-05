import {Injectable} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class NgbCalendarHelper extends NgbDateParserFormatter {
  private SEPARATOR = '-';
  private MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }

  isNumber(value: any): boolean {
    return !isNaN(this.toInteger(value));
  }

  toSentenceCase(value) {
    return value.charAt(1).toUpperCase() + value.toLowerCase().substr(1);
  }

  isMonth(value: string): boolean {
    return this.monthToInteger(value) > 0;
  }

  monthToInteger(value: string): number {
    if (value.length !== 3)
      return 0;

    value = this.toSentenceCase(value);
    return this.MONTHS.findIndex((e) => e === value) + 1;
  }

  integerToMonth(value: number): string {
    return this.MONTHS[value - 1];
  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }

  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split(this.SEPARATOR);
      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
        return {year: this.toInteger(dateParts[0]), month: null, day: null};
      } else if (dateParts.length === 2 && this.isMonth(dateParts[0]) && this.isNumber(dateParts[1])) {
        return {year: this.toInteger(dateParts[1]), month: this.monthToInteger(dateParts[0]), day: null};
      } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isMonth(dateParts[1]) && this.isNumber(dateParts[2])) {
        return {year: this.toInteger(dateParts[2]), month: this.monthToInteger(dateParts[1]), day: this.toInteger(dateParts[0])};
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    let stringDate = '';
    if (date) {
      stringDate += this.isNumber(date.day) ? this.padNumber(date.day) + this.SEPARATOR : '';
      stringDate += this.isNumber(date.month) ? this.integerToMonth(date.month) + this.SEPARATOR : '';
      stringDate += date.year;
    }
    return stringDate;
  }
}
