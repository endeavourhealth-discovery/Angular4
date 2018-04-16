import {LOCALE_ID, Pipe, PipeTransform} from "@angular/core";
import {Period} from "../models/Period";
import { DatePipe } from "@angular/common";

@Pipe({
    name: 'periodPipe'
})
export class PeriodPipe implements PipeTransform{

    transform(period: Period, format: string) : any {
        if (period) {
            var datePipe = new DatePipe('en-US');

            if (format == null || format == '')
              format = 'dd/MM/yyyy';

            const start = (period.start == null) ? '' : datePipe.transform(period.start, format);
            const end = (period.end == null) ? '' : datePipe.transform(period.end, format);

            return '(' + start.toString() + ' - ' + end.toString() + ')';
        }

        return '';
    }
}