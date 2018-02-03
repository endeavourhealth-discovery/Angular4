import {CodingService} from "../coding.service";
import {CodeSetValue} from "../models/CodeSetValue";
import {Concept} from "../models/Concept";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class EkbCodingService  implements CodingService {
	constructor (private http : Http) { }

	searchCodes(searchData : string):Observable<CodeSetValue[]> {
		//var vm = this;
		var params = new URLSearchParams();
		params.append('term', searchData);
		params.append('maxResultsSize', '20');
		params.append('start', '0');

		return this.http.get('/api/ekb/search/sct', {search: params})
			.map((result) => result.json());
	}

	getCodeChildren(id : string):Observable<CodeSetValue[]> {
		return this.http.get('/api/ekb/hierarchy/' + id + '/childHierarchy')
			.map((result) => result.json());
	}

	getCodeParents(id : string):Observable<CodeSetValue[]> {
		return this.http.get('/api/ekb/hierarchy/' + id + '/parentHierarchy')
			.map((result) => result.json());
	}

	getPreferredTerm(id : string):Observable<Concept> {
		return this.http.get('/api/ekb/concepts/' + id)
			.map((result) => result.json());
	}
}
