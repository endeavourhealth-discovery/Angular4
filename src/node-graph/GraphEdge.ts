import {GraphNode} from './GraphNode';

export class GraphEdge {
  source: GraphNode;
  target: GraphNode;
  label: string;
  data: any;
  x: number = 0;
  y: number = 0;
  d: number = 0;
}
