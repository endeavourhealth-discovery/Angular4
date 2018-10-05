import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {GraphNode} from './GraphNode';
import {GraphEdge} from './GraphEdge';
import {ResizeSensor} from 'css-element-queries';

@Component({
  selector: 'nodeGraph',
  template: '<svg #graphSvg></svg>'
})
export class NodeGraphComponent implements AfterViewInit {
	static globalId: number = 1;

	instanceId: string;
  nodeData: GraphNode[] = [];
  edgeData: GraphEdge[] = [];
  svg: any;

  force: any;
  nodes: any;
  edges: any;
  nodelabels: any;
  edgepaths: any;
  edgelabels: any;

  linkDistance = 100;
  nodeSize = 15;

  colors = d3.scale.category10();

  @ViewChild('graphSvg')
	graphSvg: ElementRef;

  @Output()
  nodeClick = new EventEmitter();

  @Output()
  nodeDblClick = new EventEmitter();

  @Output()
  linkClick = new EventEmitter();

  constructor() { }

  ngAfterViewInit() {
		this.instanceId = 'svg_' + NodeGraphComponent.globalId++;
		this.graphSvg.nativeElement.id = this.instanceId;
    this.initialize();
    let rs = new ResizeSensor(this.graphSvg.nativeElement.parentElement.parentElement, () => this.onResize(this.svg, this.force));
  }

  initialize() {
    const linkDistance = 100;
    const computedStyle = window.getComputedStyle(this.graphSvg.nativeElement.parentElement.parentElement);
    const hPadding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight) + 5;
    const width = parseFloat(computedStyle.width) - hPadding;
    const vPadding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom) + 5;
    const height = parseFloat(computedStyle.height) - vPadding;

    d3.select('#'+this.instanceId).selectAll("*").remove();

    this.svg = d3.select('#'+this.instanceId)
      .attr('width', width)
      .attr('height', height);

    this.svg.append('defs').append('marker')
      .attr({'id': 'arrowhead',
        'viewBox': '-0 -5 10 10',
        'refX': 25,
        'refY': 0,
        'orient': 'auto',
        'markerWidth': 10,
        'markerHeight': 10,
        'xoverflow': 'visible'})
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#ccc')
      .attr('stroke', '#ccc');

    const layer1 = this.svg.append('g');
    const layer2 = this.svg.append('g');
    const layer3 = this.svg.append('g');

    this.edges = layer1.selectAll('line');
    this.nodes = layer2.selectAll('circle');
    this.nodelabels = layer3.selectAll('.nodelabel');
    this.edgepaths = layer1.selectAll('.edgepath');
    this.edgelabels = layer2.selectAll('.edgelabel');

    this.force = d3.layout.force()
      .nodes(this.nodeData)
      .links(this.edgeData)
      .linkDistance(linkDistance)
      .charge(-500)
      .theta(0.1)
      .size([width, height])
      .gravity(0.05)
      .on("tick", () => this.tick(this.nodes, this.edges, this.nodelabels, this.edgepaths, this.edgelabels));
      // .start();
  }

  clear() {
    this.nodeData = [];
    this.edgeData = [];
    this.initialize();
  }

  assignColours(indexes: any[]) {
    for(let index of indexes)
      this.colors(index);
  }

  addNodeData(id: number, label: string, group: number, data: any, tooltip: string = null) {
    if (this.nodeData.findIndex(i => i.id === id) === -1)
      this.nodeData.push({id: id, label: label, group: group, data: data, x: 0, y: 0, tooltip: tooltip});
  }

  addEdgeData(source: number, target: number, label: string, data: any) {
    let src = this.nodeData.find(i => i.id === source);
    let tgt = this.nodeData.find(i => i.id === target);

    if (this.edgeData.findIndex(i => i.source === src && i.target === tgt) === -1)
      this.edgeData.push({source: src, target: tgt, label: label, data: data, x: 0, y: 0, d: 0});
  }

  start() {
      this.edges = this.edges.data(this.force.links());
      this.edges.enter()
          .append('line')
          .attr('id', (d, i) => this.instanceId + '_edge' + i)
          .attr('marker-end', 'url(#arrowhead)')
          .attr('overflow', 'invisible')
          .style('pointer-events', 'none')
          .style('stroke', '#ccc');
      this.edges.exit().remove();

      this.nodes = this.nodes.data(this.force.nodes());
      this.nodes.enter()
          .append('circle')
          .attr({'r': this.nodeSize})
          .style('fill', (d: any) => this.colors(d.group))
          .call(this.force.drag)
          .on("click", (node) => this.nodeClick.emit(node))
          .on("dblclick", (node) => this.nodeDblClick.emit(node))
          .append('title')
          .html((d) => d.tooltip);
      this.nodes.exit().remove();

      this.nodelabels = this.nodelabels.data(this.force.nodes());
      this.nodelabels.enter()
          .append('text')
          .attr({
              'x': (d: any) => d.x + this.nodeSize,
              'y': (d: any) => d.y - 4,
              'class': 'nodelabel',
              'stroke': 'black'
          })
          .text((d: any) => d.label);
      this.nodelabels.exit().remove();

      this.edgepaths = this.edgepaths.data(this.force.links());
      this.edgepaths.enter()
          .append('path')
          .attr({
              'd': (d: any) => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y,
              'class': 'edgepath',
              'fill-opacity': 0,
              'stroke-opacity': 0,
              'fill': 'blue',
              'stroke': 'red',
              'id': (d, i) => this.instanceId + '_edgepath' + i
          })
          .style('pointer-events', 'none');
      this.edgepaths.exit().remove();

      this.edgelabels = this.edgelabels.data(this.force.links());
      this.edgelabels.enter()
          .append('text')
          .attr({
              'class': 'edgelabel',
              'id': (d, i) => this.instanceId + '_edgelabel' + i,
              'dx': (d, i) => (this.linkDistance * 0.5) - (d.label.length * 2.5),
              'dy': 0,
              'font-size': 10,
              'fill': '#aaa'
          })
          .on("click", (link) => this.linkClicked(link))
          .append('textPath')
          .attr('xlink:href', (d, i) => '#' + this.instanceId + '_edgepath' + i)
          .text((d: any, i) => d.label);
      this.edgelabels.exit().remove();

      this.force.start();
  }

  tick(nodes, edges, nodelabels, edgepaths, edgelabels) {
    nodes.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

    edges.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    nodelabels
      .attr('x', (d: any) => d.x + 4 + this.nodeSize)
      .attr('y', (d: any) => d.y + 4);

    edgepaths.attr('d', (d: any) => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);

    edgelabels.attr('transform', function(d: any, i) {
      if (d.target.x < d.source.x) {
        const bbox = this.getBBox();
        const rx = bbox.x + bbox.width / 2;
        const ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      } else {
        return 'rotate(0)';
      }
    });
  }

  linkClicked(link: any) {
    this.linkClick.emit(link);
  }

  onResize(svg: any, force: any) {
    const computedStyle = window.getComputedStyle(this.graphSvg.nativeElement.parentElement.parentElement);
    const hPadding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight) + 5;
    const width = parseFloat(computedStyle.width) - hPadding;
    const vPadding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom) + 5;
    const height = parseFloat(computedStyle.height) - vPadding;
    svg.attr('width', width).attr('height', height);
    force.size([width, height]); //.resume();
  }
}
