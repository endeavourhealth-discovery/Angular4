import {Component, Input} from "@angular/core";

@Component({
	selector : 'loadingIndicator',
	template : `<div class="loading" [hidden]="done">
		<div class="loadingCaption"><i class="fa fa-spinner fa-spin"></i> {{text}}</div>
	</div>
	<div [hidden]="!done"><ng-content></ng-content></div>`,
	styles : [
		`div.loading {
      background: transparent;
      width:      100%;
      height:     100%;
      min-height: 80px;
      top:        0;
      left:       0;
      position:   relative;
  }

  div.loadingOverlay {
      opacity:    0.66;
      background: #000;
      width:      100%;
      height:     100%;
      z-index:    10;
      top:        0;
      left:       0;
      position:   fixed;
  }

  div.loadingCaption {
      text-align: center ;
      font-family: monospace ;
      font-weight: normal;
      top: 50% ;
      width:      100%;
      height:     100%;
      font-size: 26px ;
      line-height: 35px ;
      margin: 0px 0px 20px 0px ;
      position: absolute ;
  }`
	]
})
export class LoadingIndicatorComponent {
	@Input() text : string = 'Loading...';
	@Input() done : any;
}