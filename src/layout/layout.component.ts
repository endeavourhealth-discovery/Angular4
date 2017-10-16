import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router, Routes} from "@angular/router";
import {MenuAuth} from "./menuAuth.service";
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-root',
  template: `<div>
  <topnav></topnav>

  <sidebar></sidebar>

</div>`
})
export class LayoutComponent implements OnInit {

  constructor(private toastr: ToastsManager,
							private router : Router,
							private menuAuth : MenuAuth,
							vRef: ViewContainerRef) {
		this.toastr.setRootViewContainerRef(vRef);
	}

  ngOnInit() {
  	let routes : Routes = this.router.config;
  	routes = this.menuAuth.secureRoutes(routes);
  	this.router.resetConfig(routes);
  }

}
