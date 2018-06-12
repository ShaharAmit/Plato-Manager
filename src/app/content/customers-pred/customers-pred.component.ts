import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebaseService/firebase.service';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-customers-pred',
  templateUrl: './customers-pred.component.html',
  styleUrls: ['./customers-pred.component.css']
})

export class CustomersPredComponent implements OnInit {
  scatterChartData: any;
  restID: string;

  constructor(private fb: FirebaseService) {

  }

  ngOnInit() {
    this.init();
    this.loadScatterChart();
  }

  async loadScatterChart() {
    const dataTable = await this.loadData();
    console.log(dataTable);
    this.scatterChartData = {
      chartType: 'ScatterChart',
      dataTable,
      options: {
        title: 'Customers vs. days comparison (specific day, specific hour many weeks)',
        hAxis: {title: 'Weeks', minValue: 0, maxValue: 20},
        vAxis: {title: 'Customers', minValue: 0, maxValue: 20},
        legend: 'none'
      }
    };
  }

  async loadData() {
    const nextWeek = new Date(),
    // last 30 days
    twenty = new Date(),
    dataTable = [];
    dataTable.push(['Weeks', 'Customers']);
    nextWeek.setDate(nextWeek.getDate() + 7);
    twenty.setDate( twenty.getDate() - 30);
    console.log(nextWeek);

    const ref = this.fb.fs.collection(this.fb.restRoot + '/' + this.restID + '/YearlyActivity/' + (nextWeek.getDay()).toString() + '/Days');
    await ref
    .where('timestamp', '<', (nextWeek.getTime() / 1000))
    .where('timestamp', '>', (twenty.getTime() / 1000))
    .orderBy('timestamp').get().then(docs => {
      let len = 1;
      docs.forEach(doc => {
        const data = doc.data(),
        day = new Date();
        console.log(data.timestamp);
        day.setTime(data.timestamp * 1000);
        console.log(day);

        if (day.getDate() !== nextWeek.getDate() || day.getDay() !== nextWeek.getDay() || day.getFullYear() !== nextWeek.getFullYear()) {
          dataTable.push([len, data['hour0'].customersReal]);
        } else {
          dataTable.push([len, data['hour0'].customersPred]);
        }
        len++;
      });
    });
    return dataTable;
  }

  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);
  }
}
