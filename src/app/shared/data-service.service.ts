import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {GlobalDataSummary} from '../models/global-data';
import {DateWiseData} from '../models/date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/07-15-2020.csv';
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  constructor(private http: HttpClient) { }

  getGlobalData(): Observable<any>{
    return this.http.get(this.globalDataUrl, {responseType : 'text'}).pipe(
      map(res => {
        let data : GlobalDataSummary[] = [];
        let raw = {};
        const rows = res.split('\n');
        rows.splice(0, 1);

        rows.forEach(row => {
          const cols = row.split(/,(?=\S)/);

          let cs = {
            country : cols[3],
            confirmed : +cols[7],
            deaths : +cols[8],
            active : +cols[10],
            recovered : +cols[9],
          };
          let temp: GlobalDataSummary = raw[cs.country];

          if (temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          }else{
            raw[cs.country] = cs;
          }

        });
        return Object.values(raw) as GlobalDataSummary[];
      })
    );
  }

  getDateWiseData(): Observable<any>{
    return this.http.get(this.dateWiseDataUrl, { responseType : 'text'})
      .pipe(
        map(result => {
            const rows = result.split('\n');
            const mainData = {};
            const header = rows[0];
            const dates = header.split(/,(?=\S)/);
            dates.splice(0, 4);
            rows.splice(0, 1);

            rows.forEach(row => {
              const cols = row.split(/,(?=\S)/);
              const country = cols[1];
              cols.splice(0, 4);
              mainData[country] = [];
              cols.forEach((value, index) => {
                const dw: DateWiseData = {
                  cases : +value,
                  country,
                  date : new Date(Date.parse(dates[index]))
                };
                mainData[country].push(dw);
              });
            });
            console.log(mainData);
            return mainData;
          }
        )
      );
  }
}
