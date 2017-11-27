import {Component, Input, OnInit} from "@angular/core";
import 'highcharts/adapters/standalone-framework.src';
import {Chart} from "./models/Chart";

@Component({
	selector : 'chart-table',
	template : `
        <div *ngIf="data">
            <h3 class="text-center">{{data.title}}</h3>
            <table class="table table-striped table-condensed">
                <thead>
                <tr>
                    <th></th>
                    <th *ngFor="let category of data.categories">{{category}}</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let series of data.series">
                    <td><b>{{series.name}}</b></td>
                    <td *ngFor="let data of series.data">{{data}}</td>
                </tr>
                </tbody>
            </table>
        </div>
	`
})
export class TableComponent {

	@Input() data : Chart;
}