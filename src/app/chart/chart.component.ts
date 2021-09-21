import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {

  margin: any;
  svg: any;
  height: any;
  width: any;

  seasonList = [{"season":"Winter"},{"season":"Spring/Fall"},{"season":"Summer"}];

  constructor() { }

  ngAfterViewInit(): void {
    let box = document.querySelector('svg');

    this.width = box?.clientWidth;
    this.height = box?.clientHeight;  
    this.margin = {top: 20, right: 20, bottom: 20, left: 100};
    this.svg = d3.select('svg')
      .append('g') 
      .attr('transform', 'translate(' + this.margin.left + ',' + 0 + ')')
      .style("font-size","1.5em");

      var y = d3.scaleBand()
      .domain(this.seasonList.map(function(d:any) { return d.season; }))
      .rangeRound([ this.margin.top, this.height -this.margin.bottom ])
      .padding(.05)

      this.svg.selectAll(".barBackground")
      .data(this.seasonList)
      .enter().append("rect")
      .attr("class", "barBackground")
      .attr('x', 19)
      .attr('y', function(d:any) {return y(d.season)}   )
      .attr("width",  this.width/3 + 2)
      .attr("height", 52)
      .attr("fill", "white")
      .attr("stroke","black")
      .attr("stroke-width","1px")
      .attr('transform', 'translate(' + 0 + ',' + -1 + ')');
    
   
  }



  updateValues(values: any) {
  
    this.redrawPlot(values)
  }

  redrawPlot(data:any){

    this.svg.selectAll(".bar").remove()
    this.svg.selectAll(".right_axis").remove()
    
    var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, this.width/3]);


    var y = d3.scaleBand()
      .domain(data.map(function(d:any) { return d.season; }))
      .rangeRound([  this.margin.top, this.height -this.margin.bottom  ])
      .padding(.05)

    var y_right = d3.scaleBand()
      .domain(data.map(function(d:any) { return d.value.toFixed(0) + "min (" + d.percent.toFixed(0) + "%)"; }))
      .rangeRound([ this.margin.top, this.height -this.margin.bottom])
      .padding(.05)
   
    function colorBar(season: string) :string {
      switch(season){
        case "Winter":
          return "#ccda46"
        case "Summer":
          return "#90303d"
        default:
          return "#ed8240"
      }
    }
    this.svg.call(d3.axisLeft(y).tickSize(0).tickSizeOuter(0))

    let x_axis_margin = this.width/3 +40
    this.svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr('x', 20)
    .attr('y', function(d:any) {return y(d.season)}   )
    .attr("width", function(d:any) {return x(d.percent); } )
    .attr("height", 50)
    .attr("fill", function(d:any) {return colorBar(d.season)})

    this.svg.append("g").attr("class", "right_axis")
    .attr('transform', 'translate(' +  x_axis_margin + ',' + 0 + ')')
    .style("font-size","1em")
    .call(d3.axisRight(y_right).tickSize(0).tickSizeOuter(0))

    let path_style = document.querySelector('path');
    path_style?.setAttribute("style", "opacity:0")

    let path_style1 = document.querySelector('g.right_axis path.domain');
    path_style1?.setAttribute("style", "opacity:0")
  }

}
