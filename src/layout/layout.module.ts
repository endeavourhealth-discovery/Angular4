import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {SidebarComponent} from "./sidebar.component";
import {TopnavComponent} from "./topnav.component";
import {LayoutComponent} from "./layout.component";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SecurityModule} from "../security/security.module";
import {UserManagerModule} from "../user-manager/user-manager.module";
import {MenuAuth} from "./menuAuth.service";
import {StopComponent} from "./stop.component";


@NgModule({
  imports : [
    BrowserModule,
    FormsModule,
    SecurityModule,
    UserManagerModule,
    RouterModule,
    NgbModule
  ],
  declarations : [
    LayoutComponent,
    SidebarComponent,
    TopnavComponent,
		StopComponent,
  ],
	providers : [
		MenuAuth
	],
	entryComponents : [
		StopComponent
	]
})
export class LayoutModule {}
