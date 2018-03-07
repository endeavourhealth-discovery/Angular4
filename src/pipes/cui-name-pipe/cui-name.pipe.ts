import { Pipe, PipeTransform} from "@angular/core";
import {HumanName} from "../models/HumanName";

@Pipe({
    name: 'cuiNamePipe'
})
export class CuiNamePipe implements PipeTransform{

    transform(humanName: HumanName) : any {
        if (humanName) {
            const name = humanName;

            if (name.text && name.text !== '')
                return name.text;

            const surnames = (name.family == null) ? '' : name.family + ', ';
            const forenames = (name.given == null) ? '' : name.given.join(' ');
            const title = (name.prefix == null) ? '' : '(' + name.prefix.join(' ') + ')';
            const suffix = (name.suffix == null) ? '' : name.suffix.join(' ');

            return surnames + forenames + title + suffix;
        }

        return 'Not known';
    }
}