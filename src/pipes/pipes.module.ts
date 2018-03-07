import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CuiNamePipe} from "../pipes/cui-name-pipe/cui-name.pipe";
import {PeriodPipe} from "../pipes/period-pipe/period.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
      CuiNamePipe,
      PeriodPipe
  ],
  exports: [
      CuiNamePipe,
      PeriodPipe
  ]
})
export class PipesModule { }
