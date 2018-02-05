import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CuiDatePickerComponent} from './cuidate-picker/cuidate-picker.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/primeng';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    CalendarModule,
    CommonModule
  ],
  declarations: [
    CuiDatePickerComponent
  ],
  exports: [
    CuiDatePickerComponent
  ]
})
export class CuiControlsModule { }
