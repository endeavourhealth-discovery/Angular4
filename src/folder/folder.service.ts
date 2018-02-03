import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {FolderNode} from "./models/FolderNode";
import {Folder} from "./models/Folder";

@Injectable()
export class FolderService  {
	constructor(private http : Http) { }

	getFolders(moduleId : number, folderUuid : string):Observable<{folders : FolderNode[]}> {
		let params = new URLSearchParams();
		params.append('folderType', moduleId.toString());
		params.append('parentUuid', folderUuid);

		return this.http.get('api/folder/getFolders', { search : params })
			.map((result) => result.json());
	}

	saveFolder(folder: Folder):Observable<any> {
		// Make clean copy of object, just in case of additions
		// Typing the request ensures any property changes are caught
		var request : Folder = {
			uuid : folder.uuid,
			folderName : folder.folderName,
			folderType : folder.folderType,
			parentFolderUuid : folder.parentFolderUuid,
			hasChildren : folder.hasChildren,
			contentCount : folder.contentCount
		};

		return this.http.post('api/folder/saveFolder', request)
			.map((result) => result.json());
	}

	deleteFolder(folder: Folder):Observable<string> {
		// Make clean copy of object, just in case of additions
		// Typing the request ensures any property changes are caught
		var request : Folder = {
			uuid : folder.uuid,
			folderName : folder.folderName,
			folderType : folder.folderType,
			parentFolderUuid : folder.parentFolderUuid,
			hasChildren : folder.hasChildren,
			contentCount : folder.contentCount
		};

		return this.http.post('api/folder/deleteFolder', request)
			.map((result) => result.json());
	}
}
