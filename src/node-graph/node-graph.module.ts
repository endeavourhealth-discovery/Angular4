import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NvD3Module} from 'ng2-nvd3';

import 'd3';
import 'nvd3';
import {NodeGraphComponent} from './node-graph.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NvD3Module
  ],
  declarations: [NodeGraphComponent],
  exports: [NodeGraphComponent]
})
export class NodeGraphModule { }
