import { Component } from '@angular/core';

@Component({
    selector: 'wait',
    template: `
		<div class="module">
			<div class="container-fluid">
				<div class="module-body">
					<div class="row">
						<div class="col-md-12">

							<div class="card">
								<h3 class="card-header"><i class="fa fa-ban text-danger"></i> Please wait!</h3>
								<div class="card-block">
									<h4 class="card-title">Loading configuration</h4>
									<p class="card-text">You will be taken to the app shortly.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`
})
export class PleaseWaitComponent {

    constructor() { }

}
