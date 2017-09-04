import { Component } from '@angular/core';

@Component({
  selector: 'stop',
  template: `
		<div class="module">
			<div class="container-fluid">
				<div class="module-body">
					<div class="row">
						<div class="col-md-12">

							<div class="card">
								<h3 class="card-header"><i class="fa fa-ban text-danger"></i> STOP!</h3>
								<div class="card-block">
									<h4 class="card-title">Access Denied</h4>
									<p class="card-text">You have attempted to access part of the system to which you do not have permission.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`
})
export class StopComponent {

  constructor() { }

}
