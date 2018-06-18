import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebaseService/firebase.service';

@Component({
  selector: 'app-popular-dishes',
  templateUrl: './popular-dishes.component.html',
  styleUrls: ['./popular-dishes.component.css']
})
export class PopularDishesComponent implements OnInit {
  pieChartDataRank3: any;
  pieChartDataRank2: any;
  pieChartDataRank1: any;
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
    this.pieChartDataRank3 = {
      chartType: 'PieChart',
      dataTable: dataTable[0],
      options: {
        title: 'Meals top ranked',
      },
    };

    this.pieChartDataRank2 = {
      chartType: 'PieChart',
      dataTable: dataTable[1],
      options: {
        title: 'Meals mid ranked',
      },
    };

    this.pieChartDataRank1 = {
      chartType: 'PieChart',
      dataTable: dataTable[2],
      options: {
        title: 'Meals low ranked',
      },
    };
  }

  async loadData() {
    const dataTable = [];
    dataTable[0] = [];
    dataTable[1] = [];
    dataTable[2] = [];

    dataTable[0].push(['Meals', 'Likes']);
    dataTable[1].push(['Meals', 'Mid Rank']);
    dataTable[2].push(['Meals', 'Unlikes']);

    const ref = this.fb.fs.collection(this.fb.restRoot + '/' + this.restID + '/MealsRanking');
    await ref.get().then(docs => {
      docs.forEach(doc => {
        const data = doc.data();
        dataTable[0].push([doc.id, data.Rank3]);
        dataTable[1].push([doc.id, data.Rank2]);
        dataTable[2].push([doc.id, data.Rank1]);

      });
    }).catch(err => console.log(err));
    return dataTable;
  }

  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);
  }

}
