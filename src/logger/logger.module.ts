import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoggerService} from "./logger.service";
import {ToastModule} from 'ng2-toastr/ng2-toastr';

@NgModule({
	imports: [
		CommonModule,
		ToastModule
	],
    declarations: [],
	providers: [
		LoggerService
	]
})
export class LoggerModule {}