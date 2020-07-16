import { Component, OnInit } from '@angular/core';
import {DataServiceService} from '../../shared/data-service.service';
import {GlobalDataSummary} from '../../models/global-data';
import {DateWiseData} from '../../models/date-wise-data';
import {merge} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  dateWiseData;

  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData : DateWiseData[];
  loading = true;
  chart = {
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
  datatable = [];

  options: {
    height : 500,
    animation:{
      duration: 1000,
      easing: 'out',
    },
  };

  constructor(private dataSrv: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.dataSrv.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.dataSrv.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country);
        });
      }))
    ).subscribe(
      {
        complete : ()=>{
          this.onSelectCountry('US');
          this.loading = false;
        }
      }
    );

    // this.dataSrv.getDateWiseData().subscribe((res) => {
    //   this.dateWiseData = res;
    // });
    //
    // this.dataSrv.getGlobalData().subscribe((res) => {
    //   this.data = res;
    //   this.data.forEach(cs => {
    //     this.countries.push(cs.country);
    //   });
    // });
  }

  onSelectCountry(country: string): void{

    this.data.forEach(cs => {
      if (cs.country === country){
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
        this.totalConfirmed = cs.confirmed;
      }
    });

    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
    // console.log(this.selectedCountryData);
  }

  updateChart(): void{
    this.datatable = [];
    //this.datatable.push(["Date" , 'Cases']);
    this.selectedCountryData.forEach(cs => {
      this.datatable.push([cs.date , cs.cases]);
    });
  }

}
