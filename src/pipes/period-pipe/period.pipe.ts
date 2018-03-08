import {LOCALE_ID, Pipe, PipeTransform} from "@angular/core";
import {Period} from "../models/Period";
import { DatePipe } from "@angular/common";

@Pipe({
    name: 'periodPipe'
})
export class PeriodPipe implements PipeTransform{

    transform(period: Period) : any {
        if (period) {
            var datePipe = new DatePipe('en-US');

            const start = (period.start == null) ? '' : datePipe.transform(period.start, 'dd/MM/yyyy');
            const end = (period.end == null) ? '' : datePipe.transform(period.end, 'dd/MM/yyyy');

            return '(' + start.toString() + ' - ' + end.toString() + ')';
        }

        return '';
    }
}