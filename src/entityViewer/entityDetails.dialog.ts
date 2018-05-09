import {Component, Input} from "@angular/core";
import {NgbModal, NgbActiveModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'ngbd-modal-content',
    template: `
        <div class="modal-header">
            <button type="button" class="close" (click)="cancel()" aria-hidden="true">&times;</button>
            <h4 class="modal-title">{{type}} details</h4>
        </div>
        <div class="modal-body">
            <form endUserRole="form" class="container-fluid">
                <div class="row">
                    <div class="form-group col-md-12">
                        <h2>{{item[primaryProperty]}}</h2>
                    </div>
                </div>
                <div *ngFor="let detail of detailsToShow" class="row">
                    <div *ngIf="!detail.document && detail.label != 'Status' && detail.label != 'Flow status' && !detail.label.toString().toLowerCase().includes('date') && detail.label != 'Type'" class="form-group col-md-12">
                        <b>{{detail.label}} : </b>{{item[detail.property]}}
                    </div>
                    <div *ngIf="!detail.document && detail.label === 'Status'" class="form-group col-md-12">
                        <b>{{detail.label}} : </b>{{getStatus(item[detail.property])}}
                    </div>
                    <div *ngIf="!detail.document && detail.label === 'Flow status'" class="form-group col-md-12">
                        <b>{{detail.label}} : </b>{{getFlowStatus(item[detail.property])}}
                    </div>
                    <div *ngIf="!detail.document && detail.label === 'Type'" class="form-group col-md-12">
                        <b>{{detail.label}} : </b>{{getOrganisationType(item[detail.property])}}
                    </div>
                    <div *ngIf="!detail.document && detail.label.toString().toLowerCase().includes('date')" class="form-group col-md-12">
                        <b>{{detail.label}} : </b>{{item[detail.property] | date :'dd-MM-yyyy'}}
                    </div>
                    <div *ngIf="detail.document" class="form-group col-md-12">
                        <h4>Document</h4>
                        <pdf-viewer [src]="item[detail.property]"
                                    [page]="page"
                                    [original-size]="false"
                                    [render-text]="true"
                                    [show-all]="true"
                                    style="display: block;"
                        ></pdf-viewer>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn"
                    (click)="cancel()">Close</button>
            <button type="button" class="btn btn-primary"
                    (click)="ok();">View full details</button>
        </div>
    `

})
export class EntityDetailsDialog {
    @Input() item : any;
    @Input() detailsToShow : any[];
    @Input() primaryProperty : string;
    @Input() type : string;

    page : number = 1;

    public static open(modalService: NgbModal,
                       item : any,
                       detailsToShow : any[],
                       primaryProperty : string,
                       type : string) : NgbModalRef {
        const modalRef = modalService.open(EntityDetailsDialog, { backdrop : "static"});
        modalRef.componentInstance.item = item;
        modalRef.componentInstance.detailsToShow = detailsToShow;
        modalRef.componentInstance.primaryProperty = primaryProperty;
        modalRef.componentInstance.type = type;

        return modalRef;
    }

    constructor(public activeModal: NgbActiveModal) {}

    ok() {
        this.activeModal.close(true);
    }

    cancel() {
        this.activeModal.dismiss(false);
    }

    getStatus(id: number) {
        if (id == 0) {
            return "Active"
        } else {
            return "Inactive"
        }
    }

    getFlowStatus(id: number) {
        if (id == 0) {
            return "In Development"
        } else {
            return "Live"
        }
    }

    getOrganisationType(id: number) {
        switch (id) {
            case 0:
                return "GP Practice";
            case 1:
                return "NHS Trust";
            case 2:
                return "NHS Trust Site";
            case 3:
                return "Pathology Laboratory";
            case 4:
                return "Branch";
            case 5:
                return "Commissioning Region";
            case 6:
                return "Care Trust";
            case 7:
                return "Care Trust Site";
            case 8:
                return "CCG";
            case 9:
                return "CCG Site";
            case 10:
                return "CSU";
            case 11:
                return "CSU Site";
            case 12:
                return "Education Establishment";
            case 13:
                return "NHS Hospice";
            case 14:
                return "Non NHS Hospice";
            case 15:
                return "IoM Government Directorate";
            case 16:
                return "IoM Government Department";
            case 17:
                return "Justice Entity";
            case 18:
                return "Non NHS Organisation";
            case 19:
                return "NHS Support Agency";
            case 20:
                return "Optical HQ";
            case 21:
                return "Optical Site";
            case 22:
                return "Other";
            case 23:
                return "Pharmacy HQ";
            case 24:
                return "ISHP";
            case 25:
                return "ISHP Site";
            case 26:
                return "Prison";
            case 27:
                return "School";
            case 28:
                return "Special Health Authority";
            case 29:
                return "Local Authority";
            case 30:
                return "Local Authority Site";
            case 31:
                return "NI organisation";
            case 32:
                return "Scottish GP Practice";
            case 33:
                return "Scottish Provider Organisation";
            case 34:
                return "Wales Health Board";
            case 35:
                return "Wales Health Board Site";
            case 36:
                return "Dispensary";
            case 37:
                return "IoM Government Directorate Site";
        }
    }
}
