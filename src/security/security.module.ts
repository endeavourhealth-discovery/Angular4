import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SecurityService} from "./security.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    SecurityService
  ]
})
export class SecurityModule { }
