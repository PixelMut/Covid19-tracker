import { Component, OnInit } from '@angular/core';
import {DataServiceService} from '../../shared/data-service.service';
import {GlobalDataSummary} from '../../models/global-data';
import {GoogleChartInterface} from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;
  globalData: GlobalDataSummary[];
  datatable = [];
  chart = {
    PieChart : 'PieChart',
    ColumnChart : 'ColumnChart',
    LineChart : 'LineChart',
    height : 500,
    options : {
      animation : {
        duration : 1000,
        easing : 'out'
      },
      is3D : true
    }
  };

  constructor(private dataSrv: DataServiceService) { }

  ngOnInit(): void {
    this.dataSrv.getGlobalData()
      .subscribe(
        {
          next : (result) => {
            this.globalData = result;
            result.forEach((cs: GlobalDataSummary) => {
              if(!Number.isNaN(cs.confirmed)){
                this.totalConfirmed += cs.confirmed;
                this.totalActive += cs.active;
                this.totalDeaths += cs.deaths;
                this.totalRecovered += cs.recovered;
              }
            });
            this.initChart('c');
          },
          complete : () => {
            this.loading = false;
          }
        }
      );
  }

  updateChart(caseType: string): void{
    this.initChart(caseType);
  }


  initChart(caseType: string): void{

    this.datatable = [];

    this.globalData.forEach(cs => {
      let value: number;
      console.log(cs.confirmed )
      if(caseType === 'c' && cs.confirmed > 300000 && !undefined){
        value = cs.confirmed;
      }
      if(caseType === 'a' && cs.active > 200000 && !undefined){
        value = cs.active;
      }
      if(caseType === 'r' && cs.recovered > 300000 && !undefined){
        value = cs.recovered;
      }
      if(caseType === 'd' && cs.deaths > 10000 && !undefined){
        value = cs.deaths;
      }

      if (value){
        this.datatable.push([cs.country, value]);
      }
    });
    console.log(this.datatable);

    // this.pieChart = {
    //   chartType: 'PieChart',
    //   dataTable,
    //   options : {
    //     height : 500
    //   }
    // };
    // this.columnChart = {
    //   chartType: 'ColumnChart',
    //   dataTable,
    //   options : {
    //     height : 500
    //   }
    // };
  }


}
