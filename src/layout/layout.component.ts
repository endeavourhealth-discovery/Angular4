import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<div>
  <topnav></topnav>

  <sidebar></sidebar>

</div>`
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
