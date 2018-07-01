import {
  Component,
  OnInit
} from '@angular/core';
import {
  FirebaseService
} from '../../services/firebaseService/firebase.service';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.css']
})
export class WarningsComponent implements OnInit {
  restID: string;
  warnings: Object[];
  warningsObj: Object;
  constructor(private fb: FirebaseService) {
    this.warnings = [];
    this.warningsObj = {};
  }

  ngOnInit() {
    this.init();
  }

  async getWarnings() {
    // /RestAlfa/kibutz-222/Messages/alfa-1/Messages/5yfGEwRF7Gix7v7HU6oJ
    await this.fb.fs.collection(this.fb.restRoot + '/' + this.restID + '/Messages').orderBy('timestamp')
      .onSnapshot(docs => {
        docs.docChanges().forEach(change => {
          if (change && change.doc) {
            const data = change.doc.data();
            const warning: Object[] = [];
            switch (change.type) {
              case 'added':
              this.warningsObj[data.meal + data.rawMaterial] = {
                  Title: data.title,
                  Notification: data.body,
                  Type: data.alert,
                  TimeReceived: (new Date(data.timestamp)).toString().substr(0, 15),
                  Meal: data.meal,
                  RawMaterial: data.rawMaterial
                };
                break;
              case 'modified':
                if (this.warningsObj[data.meal + data.rawMaterial]) {
                  this.warningsObj[data.meal + data.rawMaterial]['TimeReceived'] = (new Date(data.timestamp)).toString().substr(0, 15);
                  this.warningsObj[data.meal + data.rawMaterial]['Notifications'] = data.body;
                }
                break;
              case 'removed':
                if (this.warningsObj[data.meal + data.rawMaterial]) {
                  delete this.warningsObj[data.meal + data.rawMaterial];
                }
                break;
            }
            const warningObjKeys = Object.keys(this.warningsObj);
            for (const key of warningObjKeys) {
              warning.push(this.warningsObj[key]);
            }
            this.warnings = warning;
          }
        });
        console.log(this.warnings);
      });
  }
  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);
    this.getWarnings();
  }

  getImage(type) {
    return 'url(/assets/images/' + type + '.png)';
  }
}
