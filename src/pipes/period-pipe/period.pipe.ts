import { Pipe, PipeTransform} from "@angular/core";
import {Period} from "../models/Period";

@Pipe({
    name: 'periodPipe'
})
export class PeriodPipe implements PipeTransform{

    transform(period: Period) : any {
        if (period) {
            const periodString = '';

            const start = (period.start == null) ? '' : period.start;
            const end = (period.end == null) ? '' : period.end;

            return '(' + start + ' - ' + end + ')';
        }

        return '';
    }
}