import {Component, forwardRef, Input} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
	selector : 'multiSelectDropdown',
	template : `<div ngbDropdown #myDrop="ngbDropdown" [autoClose]="false">
	<div class="btn btn-secondary bordered-box" id="dropdownMenu3" ngbDropdownToggle style="width: 100%"><span class="pull-left">{{getCaption()}}</span><i class="fa fa-caret-down pull-right"></i></div>
	<div class="dropdown-menu" aria-labelledby="dropdownMenu3" (mouseleave)="myDrop.close()">
		<div class="dropdown-item" (click)="selectAll()"><i class="fa fa-check"></i> Select all</div>
		<div class="dropdown-item" (click)="selectNone()"><i class="fa fa-times"></i> Unselect all</div>
		<hr>
		<div *ngFor="let item of data" class="dropdown-item" (click)="toggle(item)"><i [ngClass]="getIcon(item)"></i> {{item.name}}</div>
	</div>
</div>`,
	styles: [`.dropdown-item {
      width: 100%;
      padding: 4px 20px 4px 20px;
      cursor: pointer;
  }
  .dropdown-item:hover {
      background: #d3e9f6 !important;
  }
  .dropdown-toggle::after {
      display:none;
  }
	`],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => MultiSelectDropdownComponent),
		multi: true
	}]
})
export class MultiSelectDropdownComponent implements ControlValueAccessor {
	@Input() data : any[];

	private selectedItems : any[] = [];
	private changed = [];
	private touched = [];

	touch() {
		this.touched.forEach(f => f());
	}

	writeValue(value: any): void {
		this.selectedItems = value ? value : [];
	}

	registerOnChange(fn: any): void {
		this.changed.push(fn);
	}

	registerOnTouched(fn: any): void {
		this.touched.push(fn);
	}

	getCaption() {
		if (!this.selectedItems || this.selectedItems.length == 0)
			return "Select";
		else if (this.selectedItems.length == this.data.length)
			return "All";
		else if (this.selectedItems.length == 1)
			return "1 Item";
		else
			return this.selectedItems.length + " Items";
	}

	getIcon(item : any) {
		if (this.selectedItems.indexOf(item.id) == -1)
			return "fa fa-blank";

		return "fa fa-check";
	}

	selectAll() {
		this.selectedItems = [];
		for (let item of this.data)
			this.selectedItems.push(item.id);

		this.changed.forEach(f => f(this.selectedItems));
	}

	selectNone() {
		this.selectedItems = [];
		this.changed.forEach(f => f(this.selectedItems));
	}

	toggle(item : any) {
		var index = this.selectedItems.indexOf(item.id, 0);
		if (index == -1)
			this.selectedItems.push(item.id);
		else
			this.selectedItems.splice(index, 1);

		this.changed.forEach(f => f(this.selectedItems));
	}
}