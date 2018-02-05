import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbCalendarHelper} from '../helpers/ngb.calendar.helper';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'cui-date-picker',
  templateUrl: './cuidate-picker.component.html',
  styleUrls: ['./cuidate-picker.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbCalendarHelper},
    {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiDatePickerComponent),
    multi: true,
  }]
})
export class CuiDatePickerComponent implements ControlValueAccessor {
  private changed = [];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  value: NgbDateStruct;

  constructor() {
    let date: Date = new Date();
    this.maxDate = this.dateToNgbDateStruct(date);
    this.minDate = this.dateToNgbDateStruct(date);
    this.minDate.year = this.minDate.year - 100;
  }

  private dateToNgbDateStruct(date: Date): NgbDateStruct {
    if (!date)
      return null;

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  private ngbDateStructToDate(ngbDate: NgbDateStruct): Date {
    if (!ngbDate)
      return null;

    const date: Date = new Date();
    date.setFullYear(ngbDate.year);
    date.setMonth(ngbDate.month - 1);
    date.setDate(ngbDate.day);

    return date;
  }

  writeValue(date: Date): void {
    this.value = this.dateToNgbDateStruct(date);
  }

  setValue(value: NgbDateStruct): void {
    this.value = value;
    this.propagateChange();
  }

  registerOnChange(fn: any): void {
    this.changed.push(fn);
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange() {
    const date: Date = this.ngbDateStructToDate(this.value);
    this.changed.forEach(f => f(date));
  }
}
