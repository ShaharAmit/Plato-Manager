import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebaseService/firebase.service';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.css']
})
export class WarningsComponent implements OnInit {
  restID: string;
  warnings: Object[];
  constructor(private fb: FirebaseService) {
    this.warnings = [];
   }

  ngOnInit() {
    this.init();
  }

  async getWarnings() {
    const warnings: Object[] = [];
    // /RestAlfa/kibutz-222/Messages/alfa-1/Messages/5yfGEwRF7Gix7v7HU6oJ
    await this.fb.fs.collection(this.fb.restRoot + '/' + this.restID + '/Messages').orderBy('timestamp')
      .get()
      .then((docs) => {
        docs.forEach(doc => {
          const data = doc.data();
          warnings.push({
            Title : data.title,
            Notification : data.body,
            Type: data.alert,
            TimeReceived: (new Date(data.timestamp)).toString().substr(0, 15)
          });
        });
        console.log(warnings);
      }).catch(err => {
        console.error(err);
      });
    this.warnings = warnings;
  }
  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);
    this.getWarnings();
  }

  getImage (type) {
    return 'url(' + type + ')';
  }
}
