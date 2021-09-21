import { environment } from '../../environments/environment.prod';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {Map, View} from 'ol';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import {transform} from 'ol/proj';
import RasterSource from 'ol/source/Raster';
import {createXYZ} from 'ol/tilegrid';
import XYZ from 'ol/source/XYZ';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  
  map: any;
  imageLayer: any;
  mousePosition: any;
  values: any = [{"season":"Winter", "value": 0, "percent":0}, {"season":"Spring/Fall", "value": 0, "percent":0}, {"season":"Summer", "value": 0, "percent":0}]
  @Output() childToParent = new EventEmitter<any>()
  

  constructor() { 
    
  }

  
  ngAfterViewInit(): void {

       this.map = new Map({
      layers: [
        new TileLayer({source: new XYZ({
          url:
          'https://api.maptiler.com/maps/pastel/256/{z}/{x}/{y}@2x.png?key=IxVihBOM4lBynzvniN1A'
          })
        })
      ],
      view: new View({
        center: transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15
      }),
      target: 'map'
    });
    

    let source_winter = new RasterSource({
      sources: [
        new XYZ({
          url: "../../assets/chicago-shadows/chi-dec-21/{z}/{x}/{y}.png",
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
          
        return pixel;
      },
    });

    let source_spring_fall = new RasterSource({
      sources: [
        new XYZ({
          url: "../../assets/chicago-shadows/chi-sep-22/{z}/{x}/{y}.png",
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
          
        return pixel;
      },
    });

    let source_summer = new RasterSource({
      sources: [
        new XYZ({
          url: "../../assets/chicago-shadows/chi-jun-21/{z}/{x}/{y}.png",
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
          
        return pixel;
      },
    });

    let layer_winter = new ImageLayer({
      source: source_winter,
      zIndex: 1,
    });

    let layer_spring_fall = new ImageLayer({
      source: source_spring_fall,
      zIndex: 0,
    });

    let layer_summer = new ImageLayer({
      source: source_summer,
      zIndex: 0,
    });

    this.map.on('pointermove', (evt: any) => {
      this.mousePosition = evt.pixel;
      this.map.render();
    });


    layer_winter.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;

      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        var valueWinter = (data[3] /255) * 360;
        this.values[0].value = valueWinter;
        this.values[0].percent = valueWinter * 100/360
        this.updateValues(this.values);

       }
    });


    layer_spring_fall.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        var valueSpringFall = (data[3] /255) * 540;
        this.values[1].value = valueSpringFall;
        this.values[1].percent = valueSpringFall * 100/540
        this.updateValues(this.values);

       }
    });

    layer_summer.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        var valueSummer = (data[3] /255) * 720;
        this.values[2].value = valueSummer;
        this.values[2].percent = valueSummer * 100/720
        this.updateValues(this.values);

       }
    });

    this.map.addLayer(layer_spring_fall)
    this.map.addLayer(layer_summer)
    this.map.addLayer(layer_winter)



  }

  updateValues(values:any) {
    
    this.childToParent.emit(values)
   
  }

}
