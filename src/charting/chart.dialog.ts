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
                <div class="row">
                    <div class="col-md-12">
                        <chart [data]="chart"></chart>
                    </div>
                </div>
            </form>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="export()">Export</button>
            <button type="button" class="btn btn-default" (click)="cancel()">Close</button>
        </div>
	`
})
export class ChartDialog implements OnInit {

	public static open(modalService: NgbModal, title:string, chartData: Chart) : NgbModalRef {
		const modalRef = modalService.open(ChartDialog, { backdrop : "static", size : "lg"});
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.chart = chartData;

		return modalRef;
	}

	@Input() title;
	@Input() chartData;

	constructor(protected $uibModalInstance : NgbActiveModal) {
	}

	ngOnInit(): void {
	}

	export() {
		this.chartData.export();
	}

	cancel() {
		this.$uibModalInstance.close(null);
	}
}
