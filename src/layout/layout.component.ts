import { Component, OnInit } from '@angular/core';
import {Router, Routes} from "@angular/router";
import {MenuAuth} from "./menuAuth.service";

@Component({
  selector: 'app-root',
  template: `<div>
  <topnav></topnav>

  <sidebar></sidebar>

</div>`
})
export class LayoutComponent implements OnInit {

  constructor(private router : Router, private menuAuth : MenuAuth) { }

  ngOnInit() {
  	let routes : Routes = this.router.config;
  	routes = this.menuAuth.secureRoutes(routes);
  	this.router.resetConfig(routes);
  }

}
