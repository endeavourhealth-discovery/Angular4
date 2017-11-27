import {Component, Input, OnInit} from "@angular/core";
import {NgbModal, NgbActiveModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Chart} from "./models/Chart";

@Component({
	selector: 'ngbd-modal-content',
	template: `
        <style>
            .form-group {
                margin-bottom: 10px;
            }
        </style>
        <div class="modal-header">
            <button type="button" class="close" (click)="cancel()" aria-hidden="true">&times;</button>
            <h4 class="modal-title">{{title}}</h4>
        </div>
        <div class="modal-body">
            <form role="form">
                <ngb-tabset>
                    <ngb-tab title="Graph">
                        <ng-template ngbTabContent>
                            <div *ngFor="let chart of chart">
                                <div class="row">
                                    <div class="col-md-12">
                                        <chart [data]="chart"></chart>
                                    </div>
                                </div>
                            </div>
                        </ng-template>
                    </ngb-tab>
                    <ngb-tab title="Table">
                        <ng-template ngbTabContent>
                            <div *ngFor="let chart of chart">
                                <chart-table [data]="chart"></chart-table>
                            </div>
                        </ng-template>
                    </ngb-tab>
                </ngb-tabset>
            </form>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="export()">Export</button>
            <button type="button" class="btn btn-default" (click)="cancel()">Close</button>
        </div>
	`
})
export class StackDialog implements OnInit {

	public static open(modalService: NgbModal, title : string, chartData: Chart[]) : NgbModalRef {
		const modalRef = modalService.open(StackDialog, { backdrop : "static", size : "lg"});
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.chart = chartData;

		return modalRef;
	}

	@Input() title;
	@Input() chartData: Chart[];

	constructor(protected $uibModalInstance : NgbActiveModal) {
	}

	ngOnInit(): void {
	}

	export() {

		let rowData = [];

		for (let chart of this.chartData) {
			rowData.push(chart.title);
			rowData = rowData.concat(chart.getRowData())
		}

		let blob = new Blob([rowData.join('\n')], { type: 'text/plain' });
		window['saveAs'](blob, this.title + '.csv');
	}

	cancel() {
		this.$uibModalInstance.close(null);
	}
}
