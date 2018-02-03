import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {LibraryItem} from "./models/LibraryItem";
import {ItemSummaryList} from "./models/ItemSummaryList";

@Injectable()
export class LibraryService  {
	constructor(private http: Http) {}

	getFolderContents(folderUuid : string):Observable<ItemSummaryList> {
		let params = new URLSearchParams();
		params.append('folderUuid', folderUuid);
		return this.http.get('api/library/getFolderContents', { search : params })
			.map((result) => result.json());
	}

	getLibraryItem<T extends LibraryItem>(uuid: string): Observable<T> {
		let params = new URLSearchParams();
		params.set('uuid', uuid);
		return this.http.get('api/library/getLibraryItem', {search: params})
			.map((result) => result.json());
	}

	saveLibraryItem(libraryItem: LibraryItem): Observable<LibraryItem> {
		return this.http.post('api/library/saveLibraryItem', libraryItem)
			.map((result) => result.json());
	}

	deleteLibraryItem(uuid: string): Observable<any> {
		var libraryItem = {uuid: uuid};
		return this.http.post('api/library/deleteLibraryItem', libraryItem)
			.map((result) => result.json());
	}

	getLibraryItemNames(itemUuids : string[]): Observable<string[]> {
		let params = new URLSearchParams();

		for (let itemUuid of itemUuids)
			params.append('itemUuids', itemUuid);

		return this.http.get('api/library/getLibraryItemNames', {search: params})
			.map((result) => result.json());
	}
}
