import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

import {InputBoxDialog} from "./inputBox/inputBox.dialog";
import {MessageBoxDialog} from "./messageBox/messageBox.dialog";
import {InputBoxMultiLineDialog} from './inputBox/inputBoxMultiLine.dialog';

@NgModule({
	imports : [
		BrowserModule,
		FormsModule,
	],
	declarations : [
		InputBoxDialog,
		InputBoxMultiLineDialog,
		MessageBoxDialog,
	],
	entryComponents : [
		InputBoxDialog,
		InputBoxMultiLineDialog,
		MessageBoxDialog,
	]
})
export class DialogsModule {}
