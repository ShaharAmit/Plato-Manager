import {
  Component,
  OnInit
} from '@angular/core';
import {
  FirebaseService
} from '../../services/firebaseService/firebase.service';

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
  mealRank: Object[];
  allMealRank: Object;

  constructor(private fb: FirebaseService) {
    this.mealRank = [];
    for (let i = 0; i < 3; i++) {
      this.mealRank[i] = {};
    }
    this.allMealRank = {};
  }
  ngOnInit() {
    this.init();
    this.loadScatterChart();
  }

  async loadScatterChart() {
    this.loadData();
  }

  async loadData() {
    const ref = this.fb.fs.collection(this.fb.restRoot + '/' + this.restID + '/MealsRanking');
    ref.get().then(async docs => {
      const promises = [];
      docs.forEach(async doc => {
        if (doc && doc.data()) {
          promises.push(this.checkRanks(ref, doc.id, 'Rank3', 0));
          promises.push(this.checkRanks(ref, doc.id, 'Rank2', 1));
          promises.push(this.checkRanks(ref, doc.id, 'Rank1', 2));
        }
      });
      Promise.all(promises).then(() => {
        let sortable = [];
        for (const meal in this.allMealRank) {
          if (meal) {
            console.log(meal);
            sortable.push([meal, this.allMealRank[meal]]);
          }
        }

        sortable.sort((a, b) => {
          return b[1] - a[1];
        });
        sortable = sortable.slice(0, 5);
        const first = [],
          second = [],
          third = [];
        first.push(['Meals', 'Likes']);
        for (let i = 0; i < 5; i++) {
          if (this.mealRank[0][sortable[i][0]]) {
            first.push([sortable[i][0], this.mealRank[0][sortable[i][0]]]);
          } else {
            first.push([sortable[i][0], 0]);
          }
        }

        second.push(['Meals', 'Mid Rank']);
        for (let i = 0; i < 5; i++) {
          if (this.mealRank[1][sortable[i][0]]) {
            second.push([sortable[i][0], this.mealRank[1][sortable[i][0]]]);
          } else {
            second.push([sortable[i][0], 0]);
          }
        }

        third.push(['Meals', 'Unlikes']);
        for (let i = 0; i < 5; i++) {
          if (this.mealRank[2][sortable[i][0]]) {
            third.push([sortable[i][0], this.mealRank[2][sortable[i][0]]]);
          } else {
            third.push([sortable[i][0], 0]);
          }
        }
        const dataTable = [];
        dataTable[0] = first;
        dataTable[1] = second;
        dataTable[2] = third;

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
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  checkRanks(ref, docID, rank, i) {
    return ref.doc(docID).collection(rank).get().then(docs => {
      if (docs && docs.size) {
        this.mealRank[i][docID] = docs.size;
        if (this.allMealRank[docID]) {
          this.allMealRank[docID] += docs.size;
        } else {
          this.allMealRank[docID] = docs.size;
        }
      }
    });
  }

  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);
  }

}
