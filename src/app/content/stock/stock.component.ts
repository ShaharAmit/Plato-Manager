import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebaseService/firebase.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  restID: string;
  amounts: Object[];
  constructor(private fb: FirebaseService) {
    this.amounts = [];
   }

  ngOnInit() {
    this.init();
  }

  async getStockAmounts() {
    const amounts: Object[] = [];
    await this.fb.fs.collection(this.fb.restRoot + '/' + this.restID + '/WarehouseStock').where('value.alert', '>=', '0')
      .get()
      .then((docs) => {
        docs.forEach(doc => {
          const data = doc.data();
          // tslint:disable-next-line:max-line-length
          amounts.push({'id' : doc.id, 'amount' : data.value.amount, 'unit' : data.value.unit, 'alert': 'empty in ' + data.value.alert + ' days'});
        });
      }).catch(err => {
        console.error(err);
      });
    this.amounts = amounts;
    console.log('stock', this.amounts);
  }
  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);
    this.getStockAmounts();
  }
}
