import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
	selector : 'multiSelectDropdown',
	template : `<div class="dropdown" id="multiselect">
	<button class="dropdown-toggle btn-block text-left form-control" id="dropdownMenu3" data-toggle="dropdown" type="button">{{getCaption()}}<i class="fa fa-caret-down pull-right"></i></button>
	<div class="dropdown-menu dropdown-scrollable" aria-labelledby="dropdownMenu3">
		<div class="dropdown-item" (click)="$event.stopPropagation();selectAll()"><i class="fa fa-check"></i> Select all</div>
		<div class="dropdown-item" (click)="$event.stopPropagation();selectNone()"><i class="fa fa-times"></i> Unselect all</div>
		<hr>
		<div *ngFor="let item of data" class="dropdown-item" (click)="$event.stopPropagation();toggle(item)">
			<ng-template #tooltipTemplate>
				<div *ngIf="item.tooltip">{{item.tooltip}}</div>
				<div *ngIf="item.tooltipKvp" style="text-align: left !important;">
					<table>
						<tr *ngFor="let key of getKeys(item.tooltipKvp)">
							<td>{{key}}</td>
							<td>&nbsp;:&nbsp;</td>
							<td>{{item.tooltipKvp[key]}}</td>
						</tr>
					</table>
				</div>				
			</ng-template>
			<span [ngbTooltip]="(item.tooltip || item.tooltipKvp) ? tooltipTemplate : ''"><i [ngClass]="getIcon(item)"></i> {{item[nameField]}}</span>
		</div>
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
	@Input() nameField: string = 'name';

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
			return 'Select';
		else if (this.selectedItems.length == this.data.length)
			return 'All';
		else if (this.selectedItems.length == 1)
			return '1 Item';
		else
			return this.selectedItems.length + ' Items';
	}

	getIcon(item : any) {
		if (this.selectedItems.indexOf(item.id) == -1)
			return 'fa fa-blank';

		return 'fa fa-check';
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

	getKeys(object: any) {
		return Object.keys(object);
	}
}