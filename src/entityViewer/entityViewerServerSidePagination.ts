import {Component, EventEmitter, forwardRef, Input, Output} from "@angular/core";
import {EntityDetailsDialog} from "./entityDetails.dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
    selector : 'entity-viewer-ssp',
    template : `
        <div class="row" *ngIf="!noSearch">
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-addon" id="searchOrg">Search</span>
                    <input type="text" class="form-control" placeholder="" [(ngModel)]="filterText" [value]="filterText" name="filterText" (keyup.enter)="findEntities()">
                </div>
            </div>
            <div class="col-md-3">
                <div class="input-group">
                    <span class="input-group-addon" id="orderOrg">Order</span>
                    <select #selectedOrder class="form-control" [(ngModel)]="order" name="order" (change)="orderChange()">
                        <option *ngFor="let o of orderList" [ngValue]="o">{{o.name}}</option>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="input-group">
                    <span class="input-group-addon" id="pageSize">Items per page</span>
                    <select #selectedPageSize class="form-control" [(ngModel)]="pageSize" name="pageSize" (change)="pageSizeChange()">
                        <option *ngFor="let ps of pageSizeList" [ngValue]="ps">{{ps}}</option>
                    </select>
                </div>
            </div>
        </div>
        <br>
        <div *ngIf="items?.length == 0" class="row">
            <div class="row">
                <div class="col-md-12">
                    <p>There are no associated {{typeDescription|lowercase}}s</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div *ngFor="let item of items" class="col-md-3">
                <div [ngClass]="displayClass" class="h-100">
                    <span><b>{{item[primary]}}</b><br><p *ngIf="secondary">{{(item[secondary]?.length > 200) ? (item[secondary] | slice:0:200)+"...":item[secondary]}}<p></span>
                    <i *ngIf="allowDelete" (click)="delete(item)" class="fa fa-trash pull-left delete-endeavour-button" aria-hidden="true" style="color:red"></i>
                    <i (click)="viewItemDetails(item)" class="fa fa-info-circle pull-right info-endeavour-button" aria-hidden="true" style="color:mediumblue"></i>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <ngb-pagination [collectionSize]="totalItems" [(page)]="pageNumber" [maxSize]="20" [pageSize]="pageSize" [boundaryLinks]="true" (pageChange)="pageChanged($event)"></ngb-pagination>
            </div>
        </div>
    `
})
export class EntityViewerServerSidePagination {
    @Input() items : any[] = [];
    @Input() totalItems : number;
    @Input() typeDescription : string = '';
    @Input() model : string = '';
    @Input() primary : string = 'name';
    @Input() primaryOrderText : string = this.primary;
    @Input() detailsToShow : any[] = [];
    @Input() displayClass : string = 'region';
    @Input() secondary : string;
    @Input() secondaryOrderText : string = this.secondary;
    @Input() pageSize : number = 12;
    @Input() pageNumber : number = 1;
    @Input() maxPageSize : number = 48;
    @Input() allowDelete : boolean = false;
    @Input() noLink : boolean = false;
    @Input() noSearch: boolean = false;

    @Output() deleted: EventEmitter<string> = new EventEmitter<string>();
    @Output() onPageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() onPageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() search: EventEmitter<string> = new EventEmitter<string>();
    @Output() onOrderChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() clicked: EventEmitter<string> = new EventEmitter<string>();

    delete(item : any) {
        this.deleted.next(item);
    }

    clickOnItem(item: any) {
        this.clicked.next(item);
    }

    pageChanged($event) {
        this.onPageChange.next($event);
        this.pageNumber = $event;
    }

    findEntities() {
        this.search.next(this.filterText);
    }

    public filterText : string = "";
    p : number = 1;
    orderList = [];
    pageSizeList = [];
    order : any;

    constructor (private router: Router,
                 private $modal: NgbModal){
    };

    ngOnChanges(changes) {
        var vm = this;
        if (vm.items) {
            vm.populatePageSize();
            if (vm.orderList.length == 0)
                vm.populateOrderList();
        }
    }

    populatePageSize(){
        var vm = this;
        var i : number;
        vm.pageSizeList = [];
        if (vm.totalItems <= vm.pageSize) {
            vm.pageSizeList.push(vm.totalItems);
        }
        else {
            for (i = 4; i <= vm.maxPageSize; i = i + 4) {
                if (vm.totalItems > i)
                    vm.pageSizeList.push(i);
                if ((vm.totalItems - i) < 4 ) {
                    vm.pageSizeList.push(vm.totalItems);
                }
            }
        }
    }

    populateOrderList() {
        var vm = this;
        vm.orderList = [
            {id: 0, name: vm.primaryOrderText + " (A-Z)", column: vm.primary, descending: false},
            {id: 1, name: vm.primaryOrderText + " (Z-A)", column: vm.primary, descending: true},
        ];

        if (vm.secondary) {
            vm.orderList.push({id: 2, name: vm.secondaryOrderText + " (A-Z)", column: vm.secondary, descending: false});
            vm.orderList.push({id: 3, name: vm.secondaryOrderText + " (Z-A)", column: vm.secondary, descending: true});
        }

        if (vm.order === undefined) {
            vm.order = vm.orderList[0];
        }
    }

    editItem(item : any) {
        var vm = this;
        console.log(vm.model);
        switch (vm.model.toLowerCase()) {
            case "organisation": {
                this.router.navigate(['/organisation', item.uuid, 'edit']);
                break;
            }
            case "region" : {
                this.router.navigate(['/region', item.uuid, 'edit']);
                break;
            }
            case "dataflow" : {
                this.router.navigate(['/dataFlow', item.uuid, 'edit']);
                break;
            }
            case "dsa" : {
                this.router.navigate(['/dsa', item.uuid, 'edit']);
                break;
            }
            case "dpa" : {
                this.router.navigate(['/dpa', item.uuid, 'edit']);
                break;
            }
            case "datasharingsummary" : {
                this.router.navigate(['/dataSharingSummary', item.uuid, 'edit']);
                break;
            }
            case "dataset" : {
                this.router.navigate(['/dataSet', item.uuid, 'edit']);
                break;
            }
            case "cohort" : {
                this.router.navigate(['/cohort', item.uuid, 'edit']);
                break;
            }
        }
    }

    orderChange(): void {
        console.log(this.order);
        this.onOrderChange.next(this.order);
    }

    pageSizeChange(){
        this.onPageSizeChange.next(this.pageSize);

    }

    private viewItemDetails(item : any) {
        var vm = this;
        if (vm.noLink) {
            this.clickOnItem(item);
            return;
        }
        if (vm.detailsToShow.filter(d => d.document === true).length > 0) {
            EntityDetailsDialog.open(vm.$modal, item, vm.detailsToShow, vm.primary, vm.typeDescription)
                .result.then(function
                (result: boolean) {
                    return;
                }
            );
        }

        vm.editItem(item);
    }
}
