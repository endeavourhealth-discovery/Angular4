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
import {PleaseWaitComponent} from "./please-wait.component";
import {ControlsModule} from "../controls";


@NgModule({
  imports : [
    BrowserModule,
    FormsModule,
    SecurityModule,
    UserManagerModule,
    RouterModule,
    NgbModule,
    ControlsModule
  ],
  declarations : [
    LayoutComponent,
    SidebarComponent,
    TopnavComponent,
		StopComponent,
      PleaseWaitComponent
  ],
	providers : [
		MenuAuth
	],
	entryComponents : [
		StopComponent,
        PleaseWaitComponent
	]
})
export class LayoutModule {}
