import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { ChartComponent } from './chart/chart.component';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'shadow-maps';
  values: any;

  @ViewChild(ChartComponent) private chart!: ChartComponent;


  constructor() { }

  onReceiveChildProps(values:any){
    this.values = values
    this.updateValues(this.values)

  }

  updateValues(event: any) {
    this.chart.updateValues(event)
    
  }
}
