import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebaseService/firebase.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  restID: string;
  notifications: Object[];

  constructor(private fb: FirebaseService) {
    this.notifications = [];
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    await this.fb.restID.subscribe(message => this.restID = message);
    await this.fb.fs.collection(this.fb.restRoot + '/' + this.restID + '/Messages').orderBy('timestamp').limit(5)
    .onSnapshot(docs => {
      this.notifications = [];
      docs.forEach(doc => {
        const data = doc.data();
        this.notifications.push({
          Title : data.title,
          Type: data.alert
        });
      });
    });
  }

  getImage (type) {
    const path = '/assets/images/' + type + '.png';
    return 'url(' + path + ')';
  }
}
