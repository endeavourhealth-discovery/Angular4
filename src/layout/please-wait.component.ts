import { Component } from '@angular/core';

@Component({
    selector: 'wait',
    template: `
		<div class="module">
			<div class="container-fluid">
				<div class="module-body">
					<div class="row">
						<div class="col-md-12">
                            <loadingIndicator></loadingIndicator>							
						</div>
					</div>
				</div>
			</div>
		</div>`
})
export class PleaseWaitComponent {

    constructor() { }

}
