import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {SidebarComponent} from "./sidebar.component";
import {TopnavComponent} from "./topnav.component";
import {LayoutComponent} from "./layout.component";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SecurityModule} from "../security/security.module";

@NgModule({
  imports : [
    BrowserModule,
    FormsModule,
    SecurityModule,
    RouterModule,
    NgbModule
  ],
  declarations : [
    LayoutComponent,
    SidebarComponent,
    TopnavComponent,
  ]
})
export class LayoutModule {}
