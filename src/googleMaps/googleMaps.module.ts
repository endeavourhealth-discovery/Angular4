import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {GoogleMaps} from "./googleMaps";

@NgModule({
    imports:[
        BrowserModule,
        FormsModule
    ],
    declarations:[
        GoogleMaps
    ],
    exports:[
       GoogleMaps
    ]
})
export class GoogleMapsModule {}