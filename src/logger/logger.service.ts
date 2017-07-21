import {Injectable, ViewContainerRef} from "@angular/core";
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class LoggerService {
	constructor(private toastr : ToastsManager, private toastOpts: ToastOptions) {
		this.toastOpts.positionClass = 'toast-bottom-right';
	}

	// straight to console; bypass toastr
	log(...args:any[]) {
		console.log(args);
	}

	error(message:string, data?:{}, title?:string) {
		this.toastr.error(this.appendResponseMessage(message, data), title, {enableHTML: true});
        console.log('Error: ' + message, '\nSummary:', title, '\nDetails:', data);
	}

	info(message:string, data?:{}, title?:string) {
		this.toastr.info(this.appendResponseMessage(message, data), title, {enableHTML: true});
        console.log('Info: ' + message, '\nSummary:', title, '\nDetails:', data);
	}

	success(message:string, data?:{}, title?:string) {
		this.toastr.success(this.appendResponseMessage(message, data), title, {enableHTML: true});
        console.log('Success: ' + message, '\nSummary:', title, '\nDetails:', data);
	}

	warning(message:string, data?:{}, title?:string) {
		this.toastr.warning(this.appendResponseMessage(message, data), title, {enableHTML: true});
        console.log('Warning: ' + message, '\nSummary:', title, '\nDetails:', data);
	}

	/**
	 * if logging an error in response to an HTTP error, the data object will be a Response
	 * containing a _body property, which is a JSON string containing the error message
	 * returned from the server. If we've got one of these, append it to the message to be
	 * displayed in the toastr
     */
	private appendResponseMessage(message:string, data?:any) : string {

		try {
			if (data && '_body' in data) {

				var body = data['_body'];
				if (body) {
					var bodyObj = JSON.parse(body);
					if ('message' in bodyObj) {
						message += ':<br/>';
						message += bodyObj['message'];
					}
				}
			}
		} catch (err) {
			//if it's not JSON, then don't worry
		}

		return message;
	}
}
