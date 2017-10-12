import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MultiSelectDropdownComponent} from "./multiSelectDropdown.component";
import {InlineEditorComponent} from './inlineEdit.component';
import {LoadingIndicatorComponent} from './loadingIndicator.component';
import {Autofocus} from './focus.directive';

@NgModule({
	imports : [
		BrowserModule,
		FormsModule,
		NgbModule,
	],
	declarations : [
		MultiSelectDropdownComponent,
		InlineEditorComponent,
		LoadingIndicatorComponent,
		Autofocus
	],
	exports : [
		MultiSelectDropdownComponent,
		InlineEditorComponent,
		LoadingIndicatorComponent,
		Autofocus
	],
})
export class ControlsModule {}