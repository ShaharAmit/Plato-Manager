import {
  Component,
  OnInit
} from '@angular/core';
import {
  FirebaseService
} from '../../services/firebaseService/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restID: string;
  destroyed: any;
  inMade: any;
  totalDailyCustomers: any;
  paidTables: any;
  ready: any;
  sittingTables: any;
  todayOrderes: any;
  waitingToBeMade: any;
  mostRankedMeal: any;
  ColumnChart1: { chartType: string; dataTable: (string | number)[][]; options: { title: string; }; };
  today: string;
  oneDayAgo: string;
  twoDaysAgo: string;
  todayDate: Date;
  oneDayAgoDate: Date;
  twoDaysAgoDate: Date;
  meals: any[];
  mealsByDay: any[];
  mealsTotal: {};
  customers: any;
  scatterChartData: any;

  constructor(private fb: FirebaseService) {}

  async ngOnInit() {
    await this.init();
    this.getSales();
    this.initCustomersChart();
    this.initOrderedDishesChart();
  }

  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);

    this.todayDate = new Date(),
    this.oneDayAgoDate = new Date(),
    this.twoDaysAgoDate = new Date();
    this.oneDayAgoDate.setDate(this.todayDate.getDate() - 1);
    this.twoDaysAgoDate.setDate(this.todayDate.getDate() - 2);
    this.today = `${this.todayDate.getFullYear()}` + '-' +
    `${this.todayDate.getMonth()}` + '-' + `${this.todayDate.getDate()}`,
    this.oneDayAgo = `${this.oneDayAgoDate.getFullYear()}` + '-' +
    `${this.oneDayAgoDate.getMonth()}` + '-' + `${this.oneDayAgoDate.getDate()}`,
    this.twoDaysAgo = `${this.twoDaysAgoDate.getFullYear()}` + '-' +
    `${this.twoDaysAgoDate.getMonth()}` + '-' + `${this.twoDaysAgoDate.getDate()}`;
    this.meals = [],
    this.mealsByDay = [],
    this.mealsTotal = {};
    for (let i = 0; i < 3; i++) {
      this.mealsByDay[i] = {};
    }
    this.customers = [];
  }

  getSales() {
    this.fb.fs.doc(this.fb.restRoot + '/' + this.restID + '/restGlobals/restStatistical').onSnapshot(doc => {
      if (doc && doc.data()) {
        const data = doc.data();
        this.destroyed = data.destroyed;
        this.inMade = data.inMade;
        this.totalDailyCustomers = data.totalDailyCustomers;
        this.paidTables = data.paidTables;
        this.ready = data.ready;
        this.sittingTables = data.sittingTables;
        this.todayOrderes = data.todayOrderes;
        this.waitingToBeMade = data.waitingToBeMade;
        this.mostRankedMeal = data.mostRankedMeal;
      }
    });
  }

  async initCustomersChart() {
    const ref = this.fb.fs.doc(this.fb.restRoot + '/' + this.restID),
      dataTable = [],
      todayRef = ref.collection('YearlyActivity').doc(`${this.todayDate.getDay()}`).collection('Days').doc(this.today),
      oneDayAgoRef = ref.collection('YearlyActivity').doc(`${this.oneDayAgoDate.getDay()}`).collection('Days').doc(this.oneDayAgo),
      twoDaysAgoRef = ref.collection('YearlyActivity').doc(`${this.twoDaysAgoDate.getDay()}`).collection('Days').doc(this.twoDaysAgo);

      await this.checkcustomersRef(todayRef, 0);
      await this.checkcustomersRef(oneDayAgoRef, 1);
      await this.checkcustomersRef(twoDaysAgoRef, 2);

      let temp = this.today.split('-'),
      today = '',
      oneDayAgo = '',
      twoDaysAgo = '';
      temp[1] = (Number(temp[1]) + 1).toString();
      today = temp[0] + '-'  + temp[1] + '-' + temp[2];
      temp = this.oneDayAgo.split('-');
      temp[1] = (Number(temp[1]) + 1).toString();
      oneDayAgo = temp[0] + '-'  + temp[1] + '-' + temp[2];
      temp = this.twoDaysAgo.split('-');
      temp[1] = (Number(temp[1]) + 1).toString();
      twoDaysAgo = temp[0] + '-'  + temp[1] + '-' + temp[2];
      dataTable.push(['customers', 'day']);
      dataTable.push([twoDaysAgo, this.customers[2]]);
      dataTable.push([oneDayAgo, this.customers[1]]);
      dataTable.push([today, this.customers[0]]);

      this.scatterChartData = {
        chartType: 'LineChart',
        dataTable,
        options: {
          title: 'total customers by day',
          hAxis: {title: 'Days', minValue: 0, maxValue: 30},
          vAxis: {title: 'Customers', minValue: 0, maxValue: 30},
          legend: 'none'
        }
      };
  }

  checkcustomersRef(ref, j) {
    return ref.get().then(tod => {
      if (tod && tod.data()) {
        const todData = tod.data(),
        totalCustomersReal = todData.totalCustomersReal;
        if (totalCustomersReal) {
          this.customers[j] = totalCustomersReal;
        }
      }
    }).catch(err => console.log(err));
  }

  async initOrderedDishesChart() {
    const ref = this.fb.fs.doc(this.fb.restRoot + '/' + this.restID),
      todayRef = ref.collection('YearlyUse').doc(`${this.todayDate.getDay()}`).collection('Days').doc(this.today),
      oneDayAgoRef = ref.collection('YearlyUse').doc(`${this.oneDayAgoDate.getDay()}`).collection('Days').doc(this.oneDayAgo),
      twoDaysAgoRef = ref.collection('YearlyUse').doc(`${this.twoDaysAgoDate.getDay()}`).collection('Days').doc(this.twoDaysAgo);

    await this.checkMealRef(todayRef, 0);
    await this.checkMealRef(oneDayAgoRef, 1);
    await this.checkMealRef(twoDaysAgoRef, 2);

    let sortable = [];
    for (const meal in this.mealsTotal) {
      if (meal) {
        sortable.push([meal, this.mealsTotal[meal]]);
      }
    }
    sortable.sort((a, b) => {
        return b[1] - a[1];
    });
    sortable = sortable.slice(0, 5);

    const first = [],
      second = [],
      third = [],
      fourth = [];

    let temp = this.today.split('-'),
    today = '',
    oneDayAgo = '',
    twoDaysAgo = '';
    temp[1] = (Number(temp[1]) + 1).toString();
    today = temp[0] + '-'  + temp[1] + '-' + temp[2];
    temp = this.oneDayAgo.split('-');
    temp[1] = (Number(temp[1]) + 1).toString();
    oneDayAgo = temp[0] + '-'  + temp[1] + '-' + temp[2];
    temp = this.twoDaysAgo.split('-');
    temp[1] = (Number(temp[1]) + 1).toString();
    twoDaysAgo = temp[0] + '-'  + temp[1] + '-' + temp[2];

    fourth.push(today);
    for (let i = 0; i < 5; i++) {
      if (this.mealsByDay[0][sortable[i][0]]) {
        fourth.push(this.mealsByDay[0][sortable[i][0]]);
      } else {
        fourth.push(0);
      }
    }

    third.push(oneDayAgo);
    for (let i = 0; i < 5; i++) {
      if (this.mealsByDay[1][sortable[i][0]]) {
        third.push(this.mealsByDay[1][sortable[i][0]]);
      } else {
        third.push(0);
      }
    }

    second.push(twoDaysAgo);
    for (let i = 0; i < 5; i++) {
      if (this.mealsByDay[2][sortable[i][0]]) {
        second.push(this.mealsByDay[2][sortable[i][0]]);
      } else {
        second.push(0);
      }
    }

    first.push('Meal');
    for (let i = 0; i < 5; i++) {
      first.push(sortable[i][0]);
    }



    this.ColumnChart1 = {
      chartType: 'ColumnChart',
      dataTable: [
        first,
        second,
        third,
        fourth
      ],
      options: {
        title: '5 most ordered meals',
      },
    };
  }

  checkMealRef(ref, j) {
    return ref.get().then(tod => {
      if (tod && tod.data()) {
        const todData = tod.data(),
        mealsReal = todData.mealsReal;
        if (mealsReal) {
          const mealsRealKeys = Object.keys(mealsReal);
          for (let i = 0; i < mealsRealKeys.length; i++) {
            this.mealsByDay[j][mealsRealKeys[i]] = mealsReal[mealsRealKeys[i]];
            if (this.mealsTotal[mealsRealKeys[i]]) {
              this.mealsTotal[mealsRealKeys[i]] += mealsReal[mealsRealKeys[i]];
            }
            this.mealsTotal[mealsRealKeys[i]] = mealsReal[mealsRealKeys[i]];
          }
        }
      }
    }).catch(err => console.log(err));
  }

}
